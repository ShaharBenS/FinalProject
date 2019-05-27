let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let onlineFormsController = require('../onlineFormsControllers/onlineFormController');
let ProcessStructure = require('../../domainObjects/processStructure');
let processStructureSankey = require('../../domainObjects/processStructureSankey');
let userPermissionsController = require('../usersControllers/UsersPermissionsController');
let waitingProcessStructuresAccessor = require('../../models/accessors/waitingProcessStructuresAccessor');


module.exports.addProcessStructure = (userEmail, structureName, sankeyContent, onlineFormsIDs,automaticAdvanceTime, notificationTime, callback) =>
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
                let newProcessStructure = new ProcessStructure(structureName, structure.stages, sankeyContent, false, onlineFormsIDs, automaticAdvanceTime, notificationTime);
                if (newProcessStructure.checkNotDupStagesInStructure()) {
                    if (newProcessStructure.checkPrevNextSymmetric()) {
                        if (newProcessStructure.checkNextPrevSymmetric()) {
                            if (permissions.structureManagementPermission) {
                                processStructureAccessor.createProcessStructure(getProcessStructureForDB(newProcessStructure), (err)=>{
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
                                    automaticAdvanceTime:parseInt(automaticAdvanceTime),
                                    notificationTime: parseInt(notificationTime),
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
                    callback(new Error('קיימים שלבים כפולים'));

            }
        });
    });
};

module.exports.editProcessStructure = (userEmail, structureName, sankeyContent, onlineFormsIDs,automaticAdvanceTime, notificationTime, callback) =>
{
    userPermissionsController.getUserPermissions(userEmail, (err, permissions) => {
        if (err) {
            callback(err);
        }
        sankeyToStructure(sankeyContent, (err, structure) => {
            if (err) {
                callback(err);
            }
            else {
                let newProcessStructure = new ProcessStructure(structureName, structure.stages, sankeyContent,automaticAdvanceTime);
                if (newProcessStructure.checkNotDupStagesInStructure()) {
                    if (newProcessStructure.checkPrevNextSymmetric()) {
                        if (newProcessStructure.checkNextPrevSymmetric()) {
                            if (permissions.structureManagementPermission) {
                                processStructureAccessor.updateProcessStructure({structureName: structureName}, {
                                    $set: {
                                        available: true,
                                        stages: structure.stages,
                                        sankey: sankeyContent,
                                        onlineForms: onlineFormsIDs,
                                        automaticAdvanceTime: parseInt(automaticAdvanceTime),
                                        notificationTime: parseInt(notificationTime),
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
                                    onlineForms: onlineFormsIDs,
                                    automaticAdvanceTime: automaticAdvanceTime,
                                    notificationTime: notificationTime,
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
                    callback(new Error('There are two stages with the same number'));
            }
        });
    });
};

module.exports.removeProcessStructure = (userEmail, structureName, callback) =>
{
    userPermissionsController.getUserPermissions(userEmail,(err,permissions)=>{
        if(err){
            callback(err);
        }
        else{
            if (permissions.structureManagementPermission) {
                processStructureAccessor.deleteOneProcessStructure({structureName: structureName}, (err)=>{
                    if(err){
                        callback(err);
                    }
                    else{
                        callback(null,'');
                    }
                });
            }
            else{
                waitingProcessStructuresAccessor.addWaitingProcessStructure({
                    userEmail: userEmail,
                    structureName: structureName,
                    deleteRequest:true,
                    addOrEdit: true,
                    date: new Date(),
                    sankey: undefined,
                    onlineForms: undefined,
                    automaticAdvanceTime:undefined,
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
    });
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
    usersAndRolesController.getRoleByUsername(userEmail, (err, role) => {
        if(err) callback(err);
        else
        {
            processStructureAccessor.findProcessStructuresObjects({},(err,structures)=>{
                if(err) callback(err);
                else
                {
                    callback(null,structures.filter((structure)=> {
                        return structure.getInitialStageByRoleID(role.roleID,role.dereg) !== -1;
                    }));
                }
            });
        }
    });
};

module.exports.getAllProcessStructuresTakenNames = (callback)=>
{
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
                sankey.getSankeyStages().filter(stage=>(stage.bgColor.toLowerCase() === "#f6a500")).forEach(stage =>
                {
                    if (deletedRolesNames.includes(stage.labels[0].text)) {
                        sankey.setStageToNotFound(stage.id);
                    }
                    if (Object.keys(renamedRoles).includes(stage.labels[0].text)) {
                        sankey.changeStageName(stage.id, renamedRoles[stage.labels[0].text]);
                    }
                });
                updatedSankey[processStructure._id.toString()] = sankey.sankeyToString();

                return processStructure.stages.filter(stage=>stage.roleID !== undefined).findIndex(stage =>
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

/*********************/
/* Private Functions */
/*********************/

function getProcessStructureForDB(originProcessStructure)
{
    return {
        structureName: originProcessStructure.structureName,
        onlineForms: originProcessStructure.onlineForms,
        stages: getProcessStructureStagesForDB(originProcessStructure.stages),
        sankey: originProcessStructure.sankey,
        automaticAdvanceTime: originProcessStructure.automaticAdvanceTime,
        notificationTime: originProcessStructure.notificationTime,
    };
}

function getProcessStructureStagesForDB(originStages)
{
    let returnStages = [];
    for (let i = 0; i < originStages.length; i++) {
        returnStages.push({
            kind: originStages[i].kind,
            roleID: originStages[i].roleID,
            dereg: originStages[i].dereg,
            aboveCreatorNumber: originStages[i].aboveCreatorNumber,
            stageNum: originStages[i].stageNum,
            nextStages: originStages[i].nextStages,
            stagesToWaitFor: originStages[i].stagesToWaitFor,
            attachedFilesNames: originStages[i].attachedFilesNames
        });
    }
    return returnStages;
}

let sankeyToStructure = function (sankeyContent, callback)
{
    let processStructureSankeyObject = new processStructureSankey(JSON.parse(sankeyContent));

    if (processStructureSankeyObject.hasNoStages()) {
        callback('שגיאה: אין שלבים (צריך לפחות אחד)');
    }
    else if (processStructureSankeyObject.hasMoreThanOneFlow()) {
        callback('שגיאה: יש יותר מזרימה אחת בגרף');
    }
    else if (processStructureSankeyObject.hasMultipleConnections()) {
        callback('שגיאה: יש יותר מחיבור אחד בין 2 שלבים')
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
            if(processStructureSankeyObject.getSankeyStages().filter(sankeyStage =>
            {
                return sankeyStage.bgColor.toLowerCase() === "#ff1100";

            }).length !== 0){
                callback('שגיאה: יש ראשית למחוק תפקידים שנמחקו מהעץ (אדומים).');
                return;
            }
            let rolesName = roles.map(role =>
            {
                return role.roleName
            });
            if (!Array.from(new Set(processStructureSankeyObject.getSankeyStages().filter(sankeyStage =>
            {
                return sankeyStage.bgColor.toLowerCase() === "#f6a500";

            }).map(stage=>stage.labels[0].text))).every(roleName =>
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
            callback(null, { stages: stages});
        })
    }
};