let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let onlineFormsController = require('../onlineFormsControllers/onlineFormController');
let ProcessStructure = require('../../domainObjects/processStructure');
let processStructureSankey = require('../../domainObjects/processStructureSankey');
let userPermissionsController = require('../usersControllers/UsersPermissionsController');
let waitingProcessStructuresAccessor = require('../../models/accessors/waitingProcessStructuresAccessor');


module.exports.addProcessStructure = (userEmail, structureName, sankeyContent, onlineFormsOfStage, callback) =>
{
    userPermissionsController.getUserPermissions(userEmail, (err, permissions) =>
    {
        if (err) {
            callback(err);
        }
        sankeyToStructure(sankeyContent, onlineFormsOfStage, (err, structure) =>
        {
            if (err) {
                callback(err);
            }
            else {
                let newProcessStructure = new ProcessStructure(structureName, structure.initials, structure.stages, sankeyContent);
                if (newProcessStructure.checkNotDupStagesInStructure()) {
                    if (newProcessStructure.checkInitialsExistInProcessStages()) {
                        if (newProcessStructure.checkPrevNextSymmetric()) {
                            if (newProcessStructure.checkNextPrevSymmetric()) {
                                if (permissions.structureManagementPermission) {
                                    processStructureAccessor.createProcessStructure(this.getProcessStructureForDB(newProcessStructure), (err)=>{
                                        if(err){
                                            callback(err);
                                        }
                                        else{
                                            callback(null);
                                        }
                                    });
                                }
                                else{
                                    waitingProcessStructuresAccessor.addWaitingProcessStructure({
                                        userEmail: userEmail,
                                        structureName: structureName,
                                        addOrEdit: true,
                                        date: new Date(),
                                        sankey: sankeyContent,
                                        onlineFormsOfStage: JSON.stringify(onlineFormsOfStage),
                                    },(err)=>{
                                        if(err){
                                            callback(err);
                                        }
                                        else{
                                            callback(null,"approval");
                                        }
                                    })
                                }
                            }
                            else
                                callback(new Error('Some stages have next stages that dont contain them for previous'));
                        }
                        else
                            callback(new Error('Some stages have previous stages that dont contain them for next'));
                    }
                    else
                        callback(new Error('Some initial stages do not exist'));
                }
                else
                    callback(new Error('There are two stages with the same number'));
            }
        });
    });
};

module.exports.editProcessStructure = (userEmail, structureName, sankeyContent, onlineFormsOfStage, callback) =>
{
    userPermissionsController.getUserPermissions(userEmail, (err, permissions) =>
    {
        if (err) {
            callback(err);
        }
        sankeyToStructure(sankeyContent, onlineFormsOfStage, (err, structure) =>
        {
            if (err) {
                callback(err);
            }
            else {
                let newProcessStructure = new ProcessStructure(structureName, structure.initials, structure.stages, sankeyContent);
                if (newProcessStructure.checkNotDupStagesInStructure()) {
                    if (newProcessStructure.checkInitialsExistInProcessStages()) {
                        if (newProcessStructure.checkPrevNextSymmetric()) {
                            if (newProcessStructure.checkNextPrevSymmetric()) {
                                if (permissions.structureManagementPermission) {
                                    processStructureAccessor.updateProcessStructure({structureName: structureName}, {
                                        $set: {
                                            available: true,
                                            initials: structure.initials,
                                            stages: structure.stages,
                                            sankey: sankeyContent,
                                        }
                                    }, (err)=>{
                                        if(err){
                                            callback(err);
                                        }
                                        else{
                                            callback(null);
                                        }
                                    });
                                }
                                else{
                                    waitingProcessStructuresAccessor.addWaitingProcessStructure({
                                        userEmail: userEmail,
                                        structureName: structureName,
                                        addOrEdit: false,
                                        date: new Date(),
                                        sankey: sankeyContent,
                                    },(err)=>{
                                        if(err){
                                            callback(err);
                                        }
                                        else{
                                            callback(null,'approval');
                                        }
                                    })
                                }
                            }
                            else
                                callback(new Error('Some stages have next stages that dont contain them for previous'));
                        }
                        else
                            callback(new Error('Some stages have previous stages that dont contain them for next'));
                    }
                    else
                        callback(new Error('Some initial stages do not exist'));
                }
                else
                    callback(new Error('There are two stages with the same number'));
            }
        });
    });
};

module.exports.removeProcessStructure = (structureName, callback) =>
{
    processStructureAccessor.deleteOneProcessStructure({structureName: structureName}, callback)
};

module.exports.getProcessStructure = (name, callback) =>
{
    processStructureAccessor.findProcessStructure({structureName: name}, callback);
};

module.exports.getAllProcessStructures = (callback) =>
{
    processStructureAccessor.findProcessStructures(callback)
};

module.exports.getAllProcessStructuresTakenNames = (callback)=>{
    processStructureAccessor.findProcessStructures((err,strucures)=>{
        if(err){
            callback(err);
        }
        else{
            let structuresName = strucures.map(structure=>structure.structureName);
            waitingProcessStructuresAccessor.findWaitingProcessStructures({},(err, waitingStructures)=>{
                if(err){
                    callback(err);
                }
                else{
                    let waitingStructuresName = waitingStructures.map(waitingStructure=>waitingStructure.structureName);
                    callback(null,structuresName.concat(waitingStructuresName));
                }
            })
        }
    });
};

module.exports.getProcessStructureForDB = function (originProcessStructure)
{
    return {
        structureName: originProcessStructure.structureName,
        initials: originProcessStructure.initials,
        stages: this.getProcessStructureStagesForDB(originProcessStructure.stages),
        sankey: originProcessStructure.sankey
    };
};

module.exports.getProcessStructureStagesForDB = function (originStages)
{
    let returnStages = [];
    for (let i = 0; i < originStages.length; i++) {
        returnStages.push({
            roleID: originStages[i].roleID,
            stageNum: originStages[i].stageNum,
            nextStages: originStages[i].nextStages,
            stagesToWaitFor: originStages[i].stagesToWaitFor,
            onlineForms: originStages[i].onlineForms,
            attachedFilesNames: originStages[i].attachedFilesNames
        });
    }
    return returnStages;
};


/*********************/
/* Private Functions */
/*********************/

let sankeyToStructure = function (sankeyContent, onlineFormsOfStage, callback)
{
    let processStructureSankeyObject = new processStructureSankey(JSON.parse(sankeyContent));
    let initials = processStructureSankeyObject.getInitials();

    if (processStructureSankeyObject.hasNoStages()) {
        callback('ERROR: there are no stages (need at least one)');
    }
    else if (processStructureSankeyObject.hasMoreThanOneFlow()) {
        callback('ERROR: there are two flows in the graph');
    }
    else if (processStructureSankeyObject.hasMultipleConnections()) {
        callback('ERROR: there are multiple connections between two nodes')
    }
    else if (processStructureSankeyObject.firstStageIsNotInitial()) {
        callback('ERROR: first stage must be an initial stage')
    }
    else if (processStructureSankeyObject.hasCycles()) {
        callback('ERROR: structure contains cycles');
    }
    else {
        usersAndRolesController.getAllRoles((err, roles) =>
        {
            if (err) {
                callback(err);
                return;
            }
            onlineFormsController.getAllOnlineForms((err, formsObjects) =>
            {
                if (err) callback(err);
                else {
                    let rolesMap = {};
                    let onlineFormsMap = {};
                    let objectsMap = {};
                    formsObjects.forEach((obj) => objectsMap[obj.formName] = obj);
                    roles.forEach((role) =>
                    {
                        rolesMap[role.roleName] = role._id;
                        let formsArray = [];
                        let formIDsArray = [];
                        if (onlineFormsOfStage[role.roleName] !== undefined)
                            formsArray = onlineFormsOfStage[role.roleName];
                        formsArray.forEach((formName) =>
                        {
                            if (err) callback(err);
                            else {
                                formIDsArray.push(objectsMap[formName].formID);
                            }
                        });
                        onlineFormsMap[role._id] = formIDsArray
                    });

                    // Check if there are stages with no role.
                    let rolesName = roles.map(role =>
                    {
                        return role.roleName
                    });
                    if (!Array.from(new Set(processStructureSankeyObject.getSankeyStages().map(sankeyStage =>
                    {
                        return sankeyStage.labels[0].text;
                    }))).every(roleName =>
                    {
                        return rolesName.includes(roleName);
                    })) {
                        callback('ERROR: there is a stage with an undefined role');
                        return;
                    }

                    let stages = processStructureSankeyObject.getStages((roleName) =>
                    {
                        return rolesMap[roleName]
                    }, (roleName) =>
                    {
                        return onlineFormsMap[rolesMap[roleName]]
                    });
                    callback(null, {initials: initials, stages: stages,});
                }
            });
        })
    }
};


module.exports.setProcessStructuresUnavailable = function (deletedRolesIds, deletedRolesNames, renamedRoles, callback)
{
    processStructureAccessor.findProcessStructures((err, processStructures) =>
    {
        if (err) {
            callback(err);
        }
        else {
            let updatedSankey = {};
            let processStructuresToSetUnavailable = processStructures.filter(processStructure =>
            {
                let sankey = new processStructureSankey(JSON.parse(processStructure.sankey));
                sankey.getSankeyStages().forEach(stage =>
                {
                    if (deletedRolesNames.includes(stage.labels[0].text)) {
                        sankey.setStageToNotFound(stage.id);
                    }
                    if (Object.keys(renamedRoles).includes(stage.labels[0].text)) {
                        sankey.changeStageName(stage.id, renamedRoles[stage.labels[0].text]);
                    }
                });
                updatedSankey[processStructure._id.toString()] = sankey.sankeyToString();

                return processStructure.stages.findIndex(stage =>
                {
                    return deletedRolesIds.map(x => x.toString()).includes(stage.roleID.toString());
                }) > -1;
            }).map(processStructure =>
            {
                return processStructure._id
            });


            processStructureAccessor.updateProcessStructure({_id: {$in: processStructuresToSetUnavailable}}, {$set: {available: false}}, (err) =>
            {
                if (err) {
                    callback(err);
                }
                else {
                    Object.keys(updatedSankey).reduce((prev, curr) =>
                    {
                        return (err) =>
                        {
                            if (err) {
                                prev(err);
                            }
                            else {
                                processStructureAccessor.updateProcessStructure({_id: curr}, {$set: {sankey: updatedSankey[curr]}}, prev);
                            }
                        }
                    }, (err) =>
                    {
                        if (err) {
                            callback(err);
                        }
                        else {

                            callback(null);
                        }
                    })(null);
                }
            });
        }
    });
};

module.exports.getFormsToStages = function (structureName, callback) {
    this.getProcessStructure(structureName, (err, processStructure) => {
        if (err) callback(err);
        else if (processStructure !== null) {
            onlineFormsController.getAllOnlineForms((err, onlineFormsObjects) => {
                if (err) callback(err);
                else {
                    let formsToStages = {};
                    let formsIDsOfStages = processStructure.getFormsOfStage();
                    let formsOfStages = {};
                    onlineFormsObjects.forEach((form) => formsOfStages[form.formID] = form.formName);
                    let count = Object.keys(formsIDsOfStages).length;
                    Object.keys(formsIDsOfStages).forEach((key) => {
                        usersAndRolesController.getRoleNameByRoleID(key, (err, roleName) => {
                            //TODO OMRI: change this for to reduce or something
                            formsToStages[roleName] = [];
                            formsIDsOfStages[key].forEach((formID) => formsToStages[roleName].push(formsOfStages[formID]));
                            count--;
                            if (count === 0)
                                callback(null, formsToStages);
                        });
                    });
                }
            });

        } else callback(null, {});
    });
};