let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let onlineFormsController = require('../onlineFormsControllers/onlineFormController');
let ProcessStructure = require('../../domainObjects/processStructure');
let processStructureSankey = require('../../domainObjects/processStructureSankey');
let userPermissionsController = require('../usersControllers/UsersPermissionsController');
let waitingProcessStructuresAccessor = require('../../models/accessors/waitingProcessStructuresAccessor');


module.exports.addProcessStructure = (userEmail, structureName, sankeyContent, onlineFormsNames, callback) =>
{
    userPermissionsController.getUserPermissions(userEmail, (err, permissions) =>
    {
        if (err) {
            callback(err);
        }
        sankeyToStructure(sankeyContent, (err, structure) =>
        {
            if (err) {
                callback(err);
            }
            else {
                onlineFormsController.findOnlineFormsIDsByFormsNames(onlineFormsNames,(err,onlineFormsIDs)=>{
                    if(err) callback(err);
                    else
                    {
                        let newProcessStructure = new ProcessStructure(structureName, structure.initials, structure.stages, sankeyContent, false, onlineFormsIDs);
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
                                                onlineForms: onlineFormsIDs,
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
                                        callback(new Error('קיימים שלבים הבאים שלא מכילים את הקודמים'));
                                }
                                else
                                    callback(new Error('קיימים שלבים קודמים הלא מכילים את השלבים הבאים'));
                            }
                            else
                                callback(new Error('חלק מהשלבים ההתחלתיים לא קיימים'));
                        }
                        else
                            callback(new Error('קיימים שלבים כפולים'));
                    }
                });

            }
        });
    });
};


module.exports.editProcessStructure = (userEmail, structureName, sankeyContent, onlineFormsNames, callback) => {
    userPermissionsController.getUserPermissions(userEmail, (err, permissions) => {
        if (err) {
            callback(err);
        }
        sankeyToStructure(sankeyContent, (err, structure) => {
            if (err) {
                callback(err);
            }
            else {
                onlineFormsController.findOnlineFormsIDsByFormsNames(onlineFormsNames, (err, onlineFormsIDs) => {
                    if (err) callback(err);
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
                                                    onlineForms: onlineFormsIDs
                                                }
                                            }, (err) => {
                                                if (err) {
                                                    callback(err);
                                                }
                                                else {
                                                    callback(null);
                                                }
                                            });
                                        }
                                        else {
                                            waitingProcessStructuresAccessor.addWaitingProcessStructure({
                                                userEmail: userEmail,
                                                structureName: structureName,
                                                addOrEdit: false,
                                                date: new Date(),
                                                sankey: sankeyContent,
                                                onlineForms: onlineFormsIDs
                                            }, (err) => {
                                                if (err) {
                                                    callback(err);
                                                }
                                                else {
                                                    callback(null, 'approval');
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
    processStructureAccessor.findProcessStructures(callback);
};

module.exports.getAllProcessStructuresAvailableForUser = (userEmail, callback) =>
{
    usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
        if(err) callback(err);
        else
        {
            processStructureAccessor.findProcessStructures((err,structures)=>{
                if(err) callback(err);
                else
                {
                    callback(null,structures.filter((structure)=> {
                        return structure.initials.some((initial)=>{
                            for(let i=0;i<structure.stages.length;i++)
                            {
                                let stage = structure.stages[i];
                                if(stage.stageNum === initial && stage.roleID.id.equals(roleID.id))
                                {
                                    return true;
                                }
                            }
                            return false;
                        });
                    }));
                }
            });
        }
    });
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
        onlineForms: originProcessStructure.onlineForms,
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
            attachedFilesNames: originStages[i].attachedFilesNames
        });
    }
    return returnStages;
};


/*********************/
/* Private Functions */
/*********************/

let sankeyToStructure = function (sankeyContent, callback)
{
    let processStructureSankeyObject = new processStructureSankey(JSON.parse(sankeyContent));
    let initials = processStructureSankeyObject.getInitials();

    if (processStructureSankeyObject.hasNoStages()) {
        callback('שגיאה: אין שלבים (צריך לפחות אחד)');
    }
    else if (processStructureSankeyObject.hasMoreThanOneFlow()) {
        callback('שגיאה: יש יותר מזרימה אחת בגרף');
    }
    else if (processStructureSankeyObject.hasMultipleConnections()) {
        callback('שגיאה: יש יותר מחיבור אחד בין 2 שלבים')
    }
    else if (processStructureSankeyObject.firstStageIsNotInitial()) {
        callback('שגיאה: השלב הראשון חייב להיות שלב התחלתי')
    }
    else if (processStructureSankeyObject.hasCycles()) {
        callback('שגיאה: המבנה מכיל מעגלים');
    }
    else {
        usersAndRolesController.getAllRoles((err, roles) =>
        {
            if (err) {
                callback(err);
                return;
            }
            let rolesMap = {};
            roles.forEach((role) =>
            {
                rolesMap[role.roleName] = role._id;
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
                callback('שגיאה: יש שלב עם תפקיד שלא בעץ המשתמשים');
                return;
            }

            let stages = processStructureSankeyObject.getStages((roleName) =>
            {
                return rolesMap[roleName]
            });
            callback(null, {initials: initials, stages: stages});
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