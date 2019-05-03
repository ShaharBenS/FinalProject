let processAccessor = require('../../models/accessors/activeProcessesAccessor');
let userAccessor = require('../../models/accessors/usersAccessor');
let processReportAccessor = require('../../models/accessors/processReportAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let processReportController = require('../processesControllers/processReportController');
let processStructureController = require('./processStructureController');
let notificationsController = require('../notificationsControllers/notificationController');
let Notification = require('../../domainObjects/notification');
let onlineFormController = require('../onlineFormsControllers/onlineFormController');
let filledOnlineFormController = require('../onlineFormsControllers/filledOnlineFormController');
let fs = require('fs');
let moment = require('moment');
let ActiveProcessStage = require('../../domainObjects/activeProcessStage');
let ActiveProcess = require('../../domainObjects/activeProcess');


function getRoleIDsOfDeregStages(stages, userEmail, callback)
{
    usersAndRolesController.getRoleIdByUsername(userEmail, (err,roleID)=>{
        if(err) callback(err);
        else
        {
            let deregs = [];
            for(let i=0;i<stages.length;i++)
            {
                let stage = stages[i];
                if(stage.kind === 'ByDereg' && !deregs.includes(stage.dereg))
                {
                    deregs.push(stage.dereg);
                }
            }
            usersAndRolesController.getFatherOfDeregByArrayOfRoleIDs(roleID,deregs, callback);
        }
    });
}

function getNewActiveProcess(processStructure, role, initialStage, userEmail, processName, processDate, processUrgency, notificationTime, callback)
{
    let today = new Date();
    getRoleIDsOfDeregStages(processStructure.stages,userEmail,(err,mapOfDeregAndRole)=>{
        if(err) callback(err);
        else
        {
            let activeProcessStages = [];
            let startingDereg = parseInt(role.dereg);
            for(let i=0;i<processStructure.stages.length;i++)
            {
                let stage = processStructure.stages[i];
                let stageRoleID = stage.roleID;
                let stageUserEmail = null;
                let assignmentTime = null;
                if(stage.stageNum === initialStage)
                {
                    stageUserEmail = userEmail;
                    stageRoleID = role.roleID;
                    assignmentTime = today;
                }
                else
                {
                    if(stage.kind === 'ByDereg')
                    {
                        if(stage.dereg === role.dereg)
                        {
                            stageUserEmail = userEmail;
                            stageRoleID = role.roleID;
                        }
                        else
                        {
                            stageRoleID = mapOfDeregAndRole[stage.dereg];
                        }
                    }
                    else {
                        if (stage.kind === 'Creator') {
                            stageUserEmail = userEmail;
                            stageRoleID = role.roleID;
                        }
                    }
                }
                let activeProcessStage = new ActiveProcessStage({
                    roleID: stageRoleID, kind: stage.kind, dereg: stage.dereg,
                    stageNum: stage.stageNum, nextStages: stage.nextStages,
                    stagesToWaitFor: stage.stagesToWaitFor,
                    originStagesToWaitFor: stage.stagesToWaitFor,
                    userEmail: stageUserEmail,
                    approvalTime: null, assignmentTime: assignmentTime, notificationsCycle: 1
                });
                activeProcessStages.push(activeProcessStage);

            }
            let activeProcessToReturn = new ActiveProcess({
                processName: processName, creatorUserEmail: userEmail,
                processDate: processDate, processUrgency: processUrgency, creationTime: today,
                notificationTime: notificationTime, automaticAdvanceTime: processStructure.automaticAdvanceTime, currentStages: [initialStage], onlineForms: processStructure.onlineForms,
                filledOnlineForms: [], lastApproached: today, stageToReturnTo: initialStage
            }, activeProcessStages);
            for(let i=0;i<activeProcessToReturn.stages.length;i++)
            {
                let stage = activeProcessToReturn.stages[i];
                if(stage.kind === "ByDereg" && (stage.roleID === null || parseInt(stage.dereg) < startingDereg))
                {
                    activeProcessToReturn.removeStage(stage.stageNum);
                    i--;
                }
            }
            callback(null, activeProcessToReturn);
        }
    });
}

/**
 * Starts new process from a defined structure
 *
 * @param userEmail | The userEmail that starts the process
 * @param processStructureName | The name of the structure to start
 * @param processName | The requested name for the active process
 * @param processDate | The requested date for the active process
 * @param processUrgency | The requested urgency for the active process
 * @param callback
 */



module.exports.startProcessByUsername = (userEmail, processStructureName, processName, processDate, processUrgency, callback) => {
    usersAndRolesController.getRoleByUsername(userEmail, (err, role) => {
        if (err) {
            callback(err);
        } else {
            processStructureController.getProcessStructure(processStructureName, (err, processStructure) => {
                if (err) {
                    callback(err);
                } else {
                    if (processStructure === null || !processStructure.available) {
                        callback(new Error('This process structure is currently unavailable duo to changes in roles'));
                        return;
                    }
                    processAccessor.getActiveProcessByProcessName(processName, (err, activeProcesses) => {
                        if (err) {
                            callback(err);
                        } else {
                            if (activeProcesses === null) {
                                let initialStage = processStructure.getInitialStageByRoleID(role.roleID, role.dereg);
                                if (initialStage === -1) {
                                    callback(new Error(">>> ERROR: username " + userEmail + " don't have the proper role to start the process " + processStructureName));
                                    return;
                                }
                                getNewActiveProcess(processStructure, role, initialStage, userEmail, processName, processDate, processUrgency, processStructure.notificationTime, (err,activeProcess)=>{
                                    if(err) callback(err);
                                    else {
                                        processAccessor.createActiveProcess(activeProcess, (err) => {
                                            if(err) callback(err);
                                            else
                                            {
                                                //TODO Kuti Send Name and not email of creator
                                                processReportController.addProcessReport(processName, activeProcess.creationTime, processDate, processUrgency, userEmail, (err) => {
                                                    if (err) {
                                                        callback(err);
                                                    } else {
                                                        // Notify first role
                                                        notificationsController.addNotificationToUser(userEmail, new Notification(
                                                            processName + " מסוג " + processStructureName + " מחכה לטיפולך.", "תהליך בהמתנה"), callback);
                                                    }
                                                });
                                            }
                                        });
                                    }
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
    let waitingActiveProcesses = [];
    processAccessor.findActiveProcesses({}, (err, activeProcesses) => {
        if (err) callback(err);
        else {
            if (activeProcesses !== null) {
                activeProcesses.forEach((process) => {
                    if (process.isWaitingForUser(userEmail)) {
                        waitingActiveProcesses.push(process);
                    }
                });
                callback(null, waitingActiveProcesses);
            } else {
                callback(null, waitingActiveProcesses);
            }
        }
    });
};

module.exports.getAvailableActiveProcessesByUser = (userEmail, callback) => {
    usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
        if (err) {
            callback(err);
        } else {
            let availableActiveProcesses = [];
            processAccessor.findActiveProcesses({}, (err, activeProcesses) => {
                if (err) callback(err);
                else {
                    if (activeProcesses !== null) {
                        activeProcesses.forEach((process) => {
                            if (process.isAvailableForRole(roleID)) {
                                availableActiveProcesses.push(process);
                            }
                        });
                        callback(null, availableActiveProcesses);
                    } else {
                        callback(null, []);
                    }
                }
            });
        }
    });
};
module.exports.getAllActiveProcesses = function (callback) {
    processAccessor.getActiveProcesses(callback);
};

module.exports.getAllActiveProcessesByUser = (userEmail, callback) => {
    usersAndRolesController.getRoleIdByUsername(userEmail, (err) => {
        if (err) {
            callback(err);
        } else {
            processAccessor.findActiveProcesses({}, (err, activeProcesses) => {
                if (err) callback(err);
                else {
                    usersAndRolesController.getAllChildren(userEmail, (err, children) => {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if (activeProcesses === null)
                            activeProcesses = [];
                        let toReturnActiveProcesses = [];
                        let userEmailsArrays = [];
                        if (activeProcesses !== null) {
                            activeProcesses.forEach((process) => {
                                let flag = true;
                                let currUserEmails = [];
                                if (process.isParticipatingInProcess(userEmail)) {
                                    flag = false;
                                    toReturnActiveProcesses.push(process);
                                    currUserEmails = [userEmail];
                                }
                                children.forEach((child) => {
                                    if (process.isParticipatingInProcess(child)) {
                                        if (flag === false) {
                                            currUserEmails = currUserEmails.concat(child);
                                        } else {
                                            toReturnActiveProcesses.push(process);
                                            currUserEmails = [child];
                                            flag = false;
                                        }
                                    }
                                });
                                if (flag === false) {
                                    userEmailsArrays.push(currUserEmails);
                                }
                            });
                            callback(null, toReturnActiveProcesses);
                        } else {
                            callback(null, toReturnActiveProcesses);
                        }
                    });
                }
            });
        }
    });
};

function uploadFilesAndHandleProcess(userEmail, fields, files, callback) {
    let processName = fields.processName;
    let dirOfFiles = 'files';
    let dirOfProcess = dirOfFiles + '/' + processName;
    let fileNames = [];
    let flag = true;
    for (let file in files) {
        if (files[file].name !== "") {
            if (flag) {
                if (!fs.existsSync(dirOfFiles)) {
                    fs.mkdirSync(dirOfFiles);
                }
                if (!fs.existsSync(dirOfProcess)) {
                    fs.mkdirSync(dirOfProcess);
                }
                flag = false;
            }
            fileNames.push(files[file].name);
            let oldpath = files[file].path;
            let newpath = dirOfProcess + '/' + files[file].name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
            });
        }
    }
    let nextStageRoles = [];
    for (let attr in fields) {
        if (!isNaN(attr)) {
            nextStageRoles.push(parseInt(attr));
        }
    }
    let stage = {
        comments: fields.comments,
        fileNames: fileNames,
        nextStageRoles: nextStageRoles
    };
    handleProcess(userEmail, processName, stage, callback);
}

function assignSingleUsersToStages(process, newlyAddedStages, callback)
{
    let roleIDs = [];
    newlyAddedStages.forEach(curr=>{
        let stage = process.getStageByStageNum(curr);
        if(stage.userEmail === null) roleIDs.push(stage.roleID);
    });
    usersAndRolesController.findRolesByArray(roleIDs,(err,roles)=>{
       if(err) callback(err);
       else
       {
           roles.forEach(role=>{
              if(role.userEmail.length === 1)
              {
                  process.assignUserToStage(role._id,role.userEmail[0]);
              }
           });
           callback(null,process);
       }
    });
}


/**
 * approving process and updating stages
 *
 * @param userEmail | the user that approved
 * @param processName | the process name that approved
 * @param stageDetails | all the stage details
 * @param callback
 */
function handleProcess(userEmail, processName, stageDetails, callback) {
    processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            let foundStage = null;
            for (let i = 0; i < process.currentStages.length; i++) {
                let currentStage = process.getStageByStageNum(process.currentStages[i]);
                if (currentStage.userEmail === userEmail) {
                    foundStage = currentStage;
                    break;
                }
            }
            if(foundStage === null)
            {
                callback(new Error('HandleProcess: user not found in current stages'));
                return;
            }
            for(let i=0;i<stageDetails.nextStageRoles.length;i++)
            {
                if(!foundStage.nextStages.includes(stageDetails.nextStageRoles[i]))
                {
                    callback(new Error('HandleProcess: next stages are wrong'));
                    return;
                }
            }
            if(stageDetails.nextStageRoles === [] && foundStage.nextStages !== [])
            {
                callback(new Error('HandleProcess: next stages are empty and process cannot be finished'));
                return;
            }
            let today = new Date();
            stageDetails.stageNum = foundStage.stageNum;
            stageDetails.action = "continue";
            process.handleStage(stageDetails);
            advanceProcess(process, foundStage.stageNum, stageDetails.nextStageRoles, (err, newlyAddedStages) => {
                if (err) callback(err);
                else {
                    if (process.isFinished()) {
                        processAccessor.deleteOneActiveProcess({processName: processName}, (err) => {
                            if (err) callback(err);
                            else {
                                processReportController.addActiveProcessDetailsToReport(processName, userEmail, stageDetails, today, (err) => {
                                    if (err) callback(err);
                                    else {
                                        notificationsController.notifyFinishedProcess(process, callback);
                                    }
                                });
                            }
                        });
                    } else {
                        processReportController.addActiveProcessDetailsToReport(processName, userEmail, stageDetails, today, (err) => {
                            if(err) callback(err);
                            else {
                                notificationsController.notifyNotFinishedProcess(process, newlyAddedStages, callback);
                            }
                        });
                    }
                }
            });
        }
    });
}

/**
 * Advance process to next stage if able
 *
 * @param process
 * @param stageNum
 * @param nextStages
 * @param callback
 */
function advanceProcess(process, stageNum, nextStages, callback) {
    let addedCurrentStages = process.advanceProcess(stageNum, nextStages);
    assignSingleUsersToStages(process, addedCurrentStages,(err, process)=>{
        if(err) callback(err);
        else
        {
            let today = new Date();
            processAccessor.updateActiveProcess({processName: process.processName}, {
                currentStages: process.currentStages, stages: process.stages, lastApproached: today,
                stageToReturnTo: process.stageToReturnTo
            }, (err, res) => {
                if (err) callback(new Error(">>> ERROR: advance process | UPDATE"));
                else {
                    callback(null,addedCurrentStages);
                }
            });
        }
    });
}

module.exports.takePartInActiveProcess = (processName, userEmail, callback) => {
    processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                if (err) callback(err);
                else {
                    process.assignUserToStage(roleID, userEmail);
                    processAccessor.updateActiveProcess({processName: processName}, {stages: process.stages}, callback);
                }
            });
        }
    });
};

module.exports.unTakePartInActiveProcess = (processName, userEmail, callback) => {
    processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                if (err) callback(err);
                else {
                    process.unAssignUserToStage(roleID, userEmail);
                    processAccessor.updateActiveProcess({processName: processName}, {stages: process.stages}, callback);
                }
            });
        }
    });
};

function getActiveProcessByProcessName(processName, callback) {
    processAccessor.findActiveProcesses({processName: processName}, (err, processArray) => {
        if (err) callback(err);
        else {
            if (processArray === null || processArray.length === 0) callback(null, null);
            else callback(null, processArray[0]);
        }
    });
}

module.exports.getNextStagesRolesAndOnlineForms = function (processName, userEmail, callback) {
    getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            if (!process) {
                callback(new Error("Couldn't find process"));
            } else {
                let i, currentStage;
                for (i = 0; i < process.currentStages.length; i++) {
                    currentStage = process.getStageByStageNum(process.currentStages[i]);
                    if (currentStage.userEmail === userEmail) {
                        break;
                    }
                }
                let nextStagesArr = [];
                for (let j = 0; j < currentStage.nextStages.length; j++) {
                    nextStagesArr.push(process.getStageByStageNum(currentStage.nextStages[j]));
                }
                processReportController.getRoleNamesForArray(nextStagesArr, 0, [], (err, rolesNames) => {
                    if (err) callback(err);
                    else {
                        onlineFormController.findOnlineFormsNamesByFormsIDs(process.onlineForms, (err, onlineFormsNames) => {
                            if (err) callback(err);
                            else {
                                callback(null, [rolesNames, onlineFormsNames]);
                            }
                        });
                    }
                });
            }
        }
    });
};

module.exports.returnToCreator = function (userEmail, processName, comments, callback) {
    getActiveProcessByProcessName(processName, (err, process) => {
        if(err) callback(err);
        else
        {
            if(process.getCurrentStageNumberForUser(userEmail) === -1)
            {
                callback(new Error('Return To Creator: wrong userEmail '));
                return;
            }
            let creatorEmail = process.returnProcessToCreator();
            let today = new Date();
            let stage = {
                comments: comments,
                fileNames: [],
                action: "return",
                stageNum: process.getCurrentStageNumberForUser(userEmail)
            };
            processAccessor.updateActiveProcess({processName: processName}, {
                currentStages: process.currentStages,
                stages: process.stages,
                lastApproached: today
            }, (err) => {
                if (err) callback(err);
                else {
                    processReportController.addActiveProcessDetailsToReport(processName, userEmail, stage, today, (err) => {
                        if (err) {
                            callback(err);
                        } else {
                            notificationsController.addNotificationToUser(creatorEmail, new Notification("התהליך " + processName + " חזר אליך", "תהליך חזר ליוצר"), callback);
                        }
                    });
                }
            });
        }
    });
};

module.exports.cancelProcess = function (userEmail, processName, comments, callback) {
    getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            let today = new Date();
            let stage = {
                comments: comments,
                filledForms: [],
                fileNames: [],
                action: "cancel",
                stageNum: process.getCurrentStageNumberForUser(userEmail)
            };
            processAccessor.deleteOneActiveProcess({processName: processName}, (err) => {
                if (err) callback(err);
                else {
                    processReportController.addActiveProcessDetailsToReport(processName, userEmail, stage, today, (err) => {
                        if (err) {
                            callback(err);
                        } else {
                            notificationsController.notifyCancelledProcess(process,callback);
                        }
                    });
                }
            });
        }
    });
};

function getFilledOnlineForms(filledFormIds, index, filledFormsArray, callback) {
    if (index === filledFormIds.length) {
        callback(null, filledFormsArray);
        return;
    }
    filledOnlineFormController.getFilledOnlineFormByID(filledFormIds[index], (err, form) => {
        if (err) callback(err);
        else {
            filledFormsArray.push(form);
            getFilledOnlineForms(filledFormIds, index + 1, filledFormsArray, callback);
        }
    });
}

module.exports.updateDeletedRolesInEveryActiveProcess = (deletedRolesIds, oldTree, rootID, callback) => {
    processAccessor.getActiveProcesses((err, processes) => {
        if (err) {
            callback(err);
        } else {
            processes.forEach(process => {
                process.stages.filter(stage=>stage.roleID !== undefined).forEach(stage => {
                    if (deletedRolesIds.map(x => x.toString()).includes(stage.roleID.toString())) {
                        if (stage.userEmail === null) {
                            let findReplacement = (roleId) => {
                                let replacement = oldTree.getFatherOf(roleId);
                                if (replacement === undefined) {
                                    return rootID;
                                }
                                if (deletedRolesIds.map(x => x.toString()).includes(replacement.toString())) {
                                    return findReplacement(replacement);
                                } else {
                                    return replacement;
                                }
                            };
                            stage.roleID = findReplacement(stage.roleID);
                        }
                    }
                });
            });

            processes.reduce((prev, process) => {
                return (err) => {
                    if (err) {
                        prev(err)
                    } else {
                        processAccessor.updateAllActiveProcesses({_id: process._id}, {$set: {stages: process.stages}}, prev)
                    }
                }
            }, callback)(null);
        }
    });
};

module.exports.addFilledOnlineFormToProcess = function(processName, formID, callback){
    processAccessor.updateActiveProcess({processName: processName}, {$push : {filledOnlineForms: formID}}, (err)=>{
        if(err) callback(err);
        else
        {
            processReportAccessor.updateProcessReport({processName: processName},{$push: {filledOnlineForms: formID}},callback);
        }
    });
};

function replaceRoleIDWithRoleNameAndUserEmailWithUserName(activeProcesses, callback) {
    userAccessor.findRole({}, (err, roles) => {
        if (err) {
            callback(err);
        } else {
            userAccessor.findUsername({}, (err2, userNames) => {
                if (err2) {
                    callback(err2);

                }
                else {
                    let roleIDToRoleName = {};
                    roles.forEach(role => {
                        roleIDToRoleName[role._id.toString()] = role.roleName
                    });
                    let userEmailToUserName = {};
                    userNames.forEach(userName => {
                        userEmailToUserName[userName.userEmail] = userName.userName;
                    });
                    callback(null, activeProcesses.map(activeProcess => {
                        activeProcess.stages.forEach(stage => {
                            stage.roleName = roleIDToRoleName[stage.roleID];
                            stage.userName = userEmailToUserName[stage.userEmail];
                        });
                        return activeProcess;
                    }));
                }
            });
        }
    })
}

/////Helper Functions
function convertDate(array, isArrayOfDates) {
    for (let i = 0; i < array.length; i++) {
        let creationTime;
        let lastApproached;
        if (isArrayOfDates === undefined) {
            creationTime = array[i].creationTime;
            lastApproached = array[i].lastApproached;
        } else {
            creationTime = array[i];
            lastApproached = array[i];
        }
        creationTime = moment(creationTime).format("DD/MM/YYYY HH:mm:ss");
        lastApproached = moment(lastApproached).format("DD/MM/YYYY HH:mm:ss");
        if (isArrayOfDates === undefined) {
            array[i].creationTime = creationTime;
            array[i].lastApproached = lastApproached;
        } else {
            array[i] = creationTime;
        }
    }
}

module.exports.incrementStageCycle = (processName, stageNumbers, callback)=>{
    processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
        if(err) callback(err);
        else
        {
            process.incrementNotificationsCycle(stageNumbers);
            processAccessor.updateActiveProcess({processName: processName},{stages: process.stages},callback);
        }
    })
};

module.exports.checkUpdateResult = (result)=>{
    let keys = Array.from(Object.keys(result));
    if(keys.includes("n") && keys.includes("nModified") && keys.includes("ok") && keys.length === 3)
    {
        if(result["n"] === 1 && result["nModified"] === 1 && result["ok"] === 1)
        {
            return true;
        }
    }
    return false;
};
/////////
module.exports.replaceRoleIDWithRoleNameAndUserEmailWithUserName = replaceRoleIDWithRoleNameAndUserEmailWithUserName;
module.exports.getActiveProcessByProcessName = getActiveProcessByProcessName;
module.exports.uploadFilesAndHandleProcess = uploadFilesAndHandleProcess;
module.exports.convertDate = convertDate;
module.exports.getFilledOnlineForms = getFilledOnlineForms;
module.exports.assignSingleUsersToStages = assignSingleUsersToStages;