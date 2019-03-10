let processAccessor = require('../../models/accessors/activeProcessesAccessor');
let processReportAccessor = require('../../models/accessors/processReportAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let processReportController = require('../processesControllers/processReportController');
let processStructureController = require('./processStructureController');
let activeProcess = require('../../domainObjects/activeProcess');
let activeProcessStage = require('../../domainObjects/activeProcessStage');
let notificationsController = require('../notificationsControllers/notificationController');
let waitingActiveProcessNotification = require('../../domainObjects/notifications/waitingActiveProcessNotification');
let onlineFormController = require('../onlineFormsControllers/onlineFormController');
let fs = require('fs');


/**
 * attach form to process stage
 *
 * @param activeProcessName | the process to attach the form
 * @param stageNum | the stage in the process to attach the form
 * @param formName | the name of the from from a predefined forms
 * @param callback
 */

module.exports.attachFormToProcessStage = (activeProcessName, stageNum, formName, callback) => {
    processAccessor.getActiveProcessByProcessName(activeProcessName, (err, process) => {
        if (err) callback(err);
        else {
            onlineFormController.getOnlineFormByName(formName, (err, form) => {
                if (err) callback(err);
                else {
                    if (form === null)
                        callback(new Error("no online form was found on db with the name: " + formName));
                    else {
                        try {
                            process.attachOnlineFormToStage(stageNum, formName);
                            processAccessor.updateActiveProcess({processName: activeProcessName}, {stages: process.stages}, callback)
                        } catch (e) {
                            callback(e);
                        }
                    }
                }
            });
        }
    })
};


/**
 * Starts new process from a defined structure
 *
 * @param userEmail | The userEmail that starts the process
 * @param processStructureName | The name of the structure to start
 * @param processName | The requested name for the active process
 * @param callback
 */

module.exports.startProcessByUsername = (userEmail, processStructureName, processName, callback) => {
    usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
        if (err) {
            callback(err);
        } else {
            processStructureController.getProcessStructure(processStructureName, (err, processStructure) => {
                if (err) {
                    callback(err);
                } else {
                    if(!processStructure.available){
                        callback(new Error('This process structure is currently unavailable duo to changes in roles'));
                        return;
                    }
                    processAccessor.getActiveProcessByProcessName(processName, (err, activeProcesses) => {
                        if (err) {
                            callback(err);
                        } else {
                            if (activeProcesses === null) {
                                let initialStage = processStructure.getInitialStageByRoleID(roleID);
                                if (initialStage === -1) {
                                    callback(new Error(">>> ERROR: username " + userEmail + " don't have the proper role to start the process " + processStructureName));
                                    return;
                                }
                                let newStages = [];
                                processStructure.stages.forEach((stage) => {
                                    newStages.push({
                                        roleID: stage.roleID,
                                        userEmail: stage.stageNum === initialStage ? userEmail : null,
                                        stageNum: stage.stageNum,
                                        nextStages: stage.nextStages,
                                        stagesToWaitFor: stage.stageNum === initialStage ? [] : stage.stagesToWaitFor,
                                        originStagesToWaitFor: stage.stagesToWaitFor,
                                        approvalTime: null,
                                        onlineForms: stage.onlineForms,
                                        filledOnlineForms: [],
                                        attachedFilesNames: stage.attachedFilesNames,
                                    });
                                });
                                let today = new Date();
                                processAccessor.createActiveProcess({
                                    creationTime: today,
                                    currentStages: [initialStage],
                                    processName: processName,
                                    initials: processStructure.initials,
                                    stages: newStages,
                                    lastApproached: today,
                                }, (err) => {
                                    if (err) callback(err);
                                    else processReportController.addProcessReport(processName, today, (err)=>{
                                        if(err){
                                            callback(err);
                                        }
                                        else{
                                            // Notify first role
                                            notificationsController.addNotificationToUser(userEmail, new waitingActiveProcessNotification(
                                                "The process: " + processStructureName + ", named: " + processName + " is waiting for your approval"
                                            ),callback)
                                        }
                                    });
                                });
                            } else {
                                callback(new Error(">>> ERROR: there is already process with the name: " + processName));
                            }
                        }
                    });
                }
            });
        }
    });
};

/**
 * return array of active processesControllers for specific username
 *
 * @param userEmail
 * @param callback
 */
module.exports.getWaitingActiveProcessesByUser = (userEmail, callback) => {
    usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
        if (err) {
            callback(err);
        } else {
            let waitingActiveProcesses = [];
            processAccessor.findActiveProcesses({}, (err, activeProcesses) => {
                if (err) callback(err);
                else {
                    activeProcesses.forEach((process) => {
                        if (process.isWaitingForUser(roleID, userEmail)) {
                            waitingActiveProcesses.push(process);
                        }
                    });
                    bringRoles([],[],0,0,activeProcesses,(err,arrayOfRoles) => {
                        callback(null, [waitingActiveProcesses,arrayOfRoles]);
                    });
                }
            });
        }
    });
};

function bringRoles(subArray, fullArray, i, j, activeProcesses, callback)
{
    if(i === activeProcesses.length) {
        callback(null,fullArray);
        return;
    }
    if(j === activeProcesses[i]._currentStages.length){
        fullArray.push(subArray);
        bringRoles([],fullArray,i+1,0,activeProcesses,callback);
        return;
    }
    let currentStageNumber = activeProcesses[i]._currentStages[j];
    let currentStage = activeProcesses[i].stages[currentStageNumber];
    let roleID = currentStage.roleID;
    (function(variable){
        usersAndRolesController.getRoleNameByRoleID(roleID, (err, roleName) => {
            if (err) callback(err);
            else
            {
                variable.push(roleName);
                bringRoles(subArray,fullArray,i,j+1,activeProcesses,callback);
            }
        });
    })(subArray);
}

module.exports.getAllActiveProcessesByUser = (userEmail, callback) => {
    usersAndRolesController.getRoleIdByUsername(userEmail, (err) => {
        if (err) {
            callback(err);
        } else {
            processAccessor.findActiveProcesses({}, (err, activeProcesses) => {
                if (err) callback(err);
                else {
                    let toReturnActiveProcesses = [];
                    activeProcesses.forEach((process) => {
                        if (process.isParticipatingInProcess(userEmail))
                            toReturnActiveProcesses.push(process);
                    });
                    bringRoles([],[],0,0,activeProcesses,(err,arrayOfRoles) => {
                        callback(null, [toReturnActiveProcesses,arrayOfRoles]);
                    });
                }
            });
        }
    });
};

function uploadFilesAndHandleProcess(userEmail, processName, fields, files, callback)
{
    let dirOfFiles = 'files';
    let dirOfProcess = dirOfFiles + '/' + processName;
    let dirToUpload = dirOfProcess + '/' + userEmail;
    let fileNames = [];
    let flag = true;
    for(let file in files)
    {
        if(files[file].name !== "")
        {
            if(flag)
            {
                if (!fs.existsSync(dirOfFiles)){
                    fs.mkdirSync(dirOfFiles);
                }
                if (!fs.existsSync(dirOfProcess)){
                    fs.mkdirSync(dirOfProcess);
                }
                if (!fs.existsSync(dirToUpload)){
                    fs.mkdirSync(dirToUpload);
                }
                flag = false;
            }
            fileNames.push(files[file].name);
            let oldpath = files[file].path;
            let newpath = dirToUpload + '/' + files[file].name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
            });
        }
    }
    let nextStageRoles = [];
    for(let attr in fields)
    {
        if(!isNaN(attr))
        {
            nextStageRoles.push(parseInt(attr));
        }
    }
    let stage = {comments: fields.comments , filledForms : [], fileNames : fileNames, nextStageRoles: nextStageRoles};
    handleProcess(userEmail, processName, stage, callback);
}

/**
 * approving process and updating stages
 *
 * @param userEmail | the user that approved
 * @param processName | the process name that approved
 * @param stageDetails | all the stage details
 * @param filledForms | the filled forms
 * @param fileNames | added files
 * @param callback
 */
function handleProcess(userEmail, processName, stageDetails, callback){
    processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            let currentStage;
            for(let i=0;i<process.currentStages.length;i++)
            {
                currentStage = process.getStageByStageNum(process.currentStages[i]);
                if(currentStage.userEmail === userEmail)
                {
                    break;
                }
            }
            stageDetails.stageNum = currentStage.stageNum;
            stageDetails.action = "continue";
            process.handleStage(stageDetails);
            let today = new Date();
            processAccessor.updateActiveProcess({processName: processName}, {
                    stages: process.stages,
                    lastApproached: today
                },
                (err) => {
                    if (err) callback(err);
                    else {
                        advanceProcess(processName, stageDetails.nextStageRoles, (err)=>{
                            if (err) callback(err);
                            else
                            {
                                processReportController.addActiveProcessDetailsToReport(processName, userEmail, stageDetails, today,callback);
                            }
                        });
                    }
                });
        }
    });
}

/**
 * Advance process to next stage if able
 *
 * @param processName
 * @param nextStages
 * @param callback
 */
const advanceProcess = (processName, nextStages, callback) => {
    processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
        if (err) {
            callback(err);
        } else {
            process.advanceProcess(nextStages);
            processAccessor.updateActiveProcess({processName: processName}, {
                    currentStages: process.currentStages, stages: process.stages
                }, (err, res) => {
                    if (err) callback(new Error(">>> ERROR: advance process | UPDATE"));
                    else callback(null, res);
                });
        }
    });
};

const addProcessReport = (processName, creationTime, callback) => {
    processAccessor.createProcessReport({
        processName: processName,
        status: 'activated',
        creationTime: creationTime,
        stages: []
    }, (err) => {
        if (err) callback(err);
        else callback(null);
    });
};

const addActiveProcessDetailsToReport = (processName, userEmail, stageNum, approvalTime, comments, callback) => {
    processAccessor.findProcessReport({processName: processName}, (err, processReport) => {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                if (err) callback(err);
                else {
                    let newStage = {
                        roleID: roleID, userEmail: userEmail, stageNum: stageNum, approvalTime: approvalTime,
                        comments: comments
                    };
                    let stages = [];
                    processReport.stages.forEach((stage) => {
                        stages.push({
                            roleID: stage.roleID,
                            userEmail: stage.userEmail,
                            stageNum: stage.stageNum,
                            approvalTime: stage.approvalTime,
                            comments: stage.comments
                        })
                    });
                    stages.push(newStage);
                    processAccessor.updateProcessReport({processName: processName}, {stages: stages}, (err) => {
                        if (err) callback(err);
                        else callback(null);
                    });
                }
            });
        }
    });
};

module.exports.getAllActiveProcessDetails = (processName, callback) => {
    processReportAccessor.findProcessReport({processName: processName}, (err, processReport) => {
        if (err) callback(err);
        else {
            processReport = processReport[0]._doc;
            let returnProcessDetails = {
                processName: processReport.processName, creationTime: processReport.creationTime,
                status: processReport.status
            };
            returnStagesWithRoleName(0, processReport.stages, [], (err, newStages) => {
                callback(null, [returnProcessDetails, newStages]);
            });
        }
    });
};

const returnStagesWithRoleName = (index, stages, newStages, callback) => {
    if (index === stages.length) {
        callback(null, newStages);
    } else {
        let stage = stages[index];
        usersAndRolesController.getRoleNameByRoleID(stage.roleID, (err, roleName) => {
            if (err) callback(err);
            else {
                newStages.push({
                    roleID: roleName, userEmail: stage.userEmail,
                    stageNum: stage.stageNum, approvalTime: stage.approvalTime, comments: stage.comments
                });
                returnStagesWithRoleName(index + 1, stages, newStages, callback);
            }
        });
    }
};

module.exports.takePartInActiveProcess = (processName, userEmail, callback) => {
    processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                if (err) callback(err);
                else {
                    let newStages = [];
                    process.stages.forEach((stage) => {
                        newStages.push(
                            {
                                roleID: stage.roleID,
                                userEmail: (process.currentStages.includes(stage.stageNum) && stage.roleID.id.equals(roleID.id) ? userEmail : stage.userEmail),
                                stageNum: stage.stageNum,
                                nextStages: stage.nextStages,
                                stagesToWaitFor: stage.stagesToWaitFor,
                                originStagesToWaitFor: stage.originStagesToWaitFor,
                                approvalTime: stage.approvalTime,
                                onlineForms: stage.onlineForms,
                                filledOnlineForms: stage.filledOnlineForms,
                                attachedFilesNames: stage.attachedFilesNames,
                                comments: stage.comments
                            });
                    });
                    processAccessor.updateActiveProcess({processName: processName}, {stages: newStages}, callback);
                }
            });
        }
    });
};

module.exports.unTakePartInActiveProcess = (processName, userEmail, callback) => {
    processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            let newStages = [];
            process.stages.forEach((stage) => {
                newStages.push(
                    {
                        roleID: stage.roleID,
                        userEmail: (process.currentStages.includes(stage.stageNum) && stage.userEmail === userEmail ? null : stage.userEmail),
                        stageNum: stage.stageNum,
                        nextStages: stage.nextStages,
                        stagesToWaitFor: stage.stagesToWaitFor,
                        originStagesToWaitFor: stage.originStagesToWaitFor,
                        approvalTime: stage.approvalTime,
                        onlineForms: stage.onlineForms,
                        filledOnlineForms: stage.filledOnlineForms,
                        attachedFilesNames: stage.attachedFilesNames,
                        comments: stage.comments
                    });
            });
            processAccessor.updateActiveProcess({processName: processName}, {stages: newStages}, callback);
        }
    });
};

function getActiveProcessByProcessName(processName, callback) {
    processAccessor.findActiveProcesses({processName: processName}, (err, processArray) => {
        if (err) callback(err);
        else {
            if (processArray.length === 0) callback(null, null);
            else callback(null, processArray[0]);
        }
    });
}

function getRoleNamesForArray(stages,index,roleNamesArray,callback){
    if(index === stages.length) {
        callback(null,roleNamesArray);
        return;
    }
    let roleID = stages[index].roleID;
    (function(array,stageNum){
        usersAndRolesController.getRoleNameByRoleID(roleID, (err, roleName) => {
            if (err) callback(err);
            else
            {
                array.push([roleName,stageNum]);
                getRoleNamesForArray(stages,index+1,roleNamesArray,callback);
            }
        });
    })(roleNamesArray,stages[index].stageNum);
}

module.exports.getNextStagesRoles = function(processName, userEmail, callback){
    getActiveProcessByProcessName(processName,(err,process)=>{
        if(err) callback(err);
        else
        {
            if(!process)
            {
                callback(new Error("Couldn't find process"));
            }
            else
            {
                let i,currentStage;
                for(i=0;i<process.currentStages.length;i++)
                {
                    currentStage = process.getStageByStageNum(process.currentStages[i]);
                    if(currentStage.userEmail === userEmail)
                    {
                        break;
                    }
                }
                let nextStagesArr = [];
                for(let j=0;j<currentStage.nextStages.length;j++)
                {
                    nextStagesArr.push(process.getStageByStageNum(currentStage.nextStages[j]));
                }
                getRoleNamesForArray(nextStagesArr,0,[],callback);
            }
        }
    });

};

module.exports.returnToCreator = function(userEmail,processName,comments,callback){
    getActiveProcessByProcessName(processName,(err,process)=>{
        process.currentStages = process.initials;
        process.returnAllOriginalStagesToWaitFor();
        let today = new Date();
        let stage = {comments: comments , filledForms : [], fileNames : [], action: "return", stageNum: process.getStageNumberForUser(userEmail)};
        processAccessor.updateActiveProcess({processName: processName}, {
            stages: process.stages,
            lastApproached: today
        },(err)=>{
           if(err) callback(err);
           else
           {
               processReportController.addActiveProcessDetailsToReport(processName, userEmail, stage, today,callback);
           }
        });
    });
};

/////Helper Functions
function convertDate(array,isNotifications) {
    for (let i = 0; i < array.length; i++) {
        let creationTime;
        let lastApproached;

        if(isNotifications === undefined){
            creationTime = array[i]._creationTime;
            lastApproached = array[i]._lastApproached;
        }
        else{
            creationTime = array[i];
            lastApproached = array[i];
        }

        let dayOfCreationTime = creationTime.getDate();
        let dayOfLastApproached = lastApproached.getDate();
        let monthOfCreationTime = creationTime.getMonth() + 1;
        let monthOfLastApproached = lastApproached.getMonth() + 1;
        let yearOfCreationTime = creationTime.getFullYear();
        let yearOfLastApproached = lastApproached.getFullYear();
        if (dayOfCreationTime < 10) {
            dayOfCreationTime = '0' + dayOfCreationTime;
        }
        if (dayOfLastApproached < 10) {
            dayOfLastApproached = '0' + dayOfLastApproached;
        }
        if (monthOfCreationTime < 10) {
            monthOfCreationTime = '0' + monthOfCreationTime;
        }
        if (monthOfLastApproached < 10) {
            monthOfLastApproached = '0' + monthOfLastApproached;
        }
        let dateOfCreationTime = dayOfCreationTime + '/' + monthOfCreationTime + '/' + yearOfCreationTime;
        let dateOfLastApproached = dayOfLastApproached + '/' + monthOfLastApproached + '/' + yearOfLastApproached;
        let hourOfCreationTime = creationTime.getHours();
        let hourOfLastApproached = lastApproached.getHours();
        let minuteOfCreationTime = creationTime.getMinutes();
        let minuteOfLastApproached = lastApproached.getMinutes();
        let secondsOfCreationTime = creationTime.getSeconds();
        let secondsOfLastApproached = lastApproached.getSeconds();
        if (hourOfCreationTime.toString().length === 1)
            hourOfCreationTime = '0' + hourOfCreationTime;
        if (hourOfLastApproached.toString().length === 1)
            hourOfLastApproached = '0' + hourOfLastApproached;
        if (minuteOfCreationTime.toString().length === 1)
            minuteOfCreationTime = '0' + minuteOfCreationTime;
        if (minuteOfLastApproached.toString().length === 1)
            minuteOfLastApproached = '0' + minuteOfLastApproached;
        if (secondsOfCreationTime.toString().length === 1)
            secondsOfCreationTime = '0' + secondsOfCreationTime;
        if (secondsOfLastApproached.toString().length === 1)
            secondsOfLastApproached = '0' + secondsOfLastApproached;
        dateOfCreationTime = dateOfCreationTime + ' ' + hourOfCreationTime + ':' + minuteOfCreationTime + ':' + secondsOfCreationTime;
        dateOfLastApproached = dateOfLastApproached + ' ' + hourOfLastApproached + ':' + minuteOfLastApproached + ':' + secondsOfLastApproached;
        if(isNotifications === undefined){
            array[i]._creationTime = dateOfCreationTime;
            array[i]._lastApproached = dateOfLastApproached;
        }
        else{
            array[i] = dateOfCreationTime;
        }
    }
}

function convertJustCreationTime(process) {
    let creationTime = process.creationTime;
    let dayOfCreationTime = creationTime.getDate();
    let monthOfCreationTime = creationTime.getMonth() + 1;
    let yearOfCreationTime = creationTime.getFullYear();
    if (dayOfCreationTime < 10) {
        dayOfCreationTime = '0' + dayOfCreationTime;
    }
    if (monthOfCreationTime < 10) {
        monthOfCreationTime = '0' + monthOfCreationTime;
    }
    let dateOfCreationTime = dayOfCreationTime + '/' + monthOfCreationTime + '/' + yearOfCreationTime;
    let hourOfCreationTime = creationTime.getHours();
    let minuteOfCreationTime = creationTime.getMinutes();
    let secondsOfCreationTime = creationTime.getSeconds();
    if (hourOfCreationTime.toString().length === 1)
        hourOfCreationTime = '0' + hourOfCreationTime;
    if (minuteOfCreationTime.toString().length === 1)
        minuteOfCreationTime = '0' + minuteOfCreationTime;
    if (secondsOfCreationTime.toString().length === 1)
        secondsOfCreationTime = '0' + secondsOfCreationTime;
    dateOfCreationTime = dateOfCreationTime + ' ' + hourOfCreationTime + ':' + minuteOfCreationTime + ':' + secondsOfCreationTime;
    process.creationTime = dateOfCreationTime;
}
/////

module.exports.getActiveProcessByProcessName = getActiveProcessByProcessName;
module.exports.uploadFilesAndHandleProcess = uploadFilesAndHandleProcess;

module.exports.convertDate = convertDate;
module.exports.convertJustCreationTime = convertJustCreationTime;

