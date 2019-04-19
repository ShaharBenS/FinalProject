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
                if(stage.stageNum === initialStage)
                {
                    stageUserEmail = userEmail;
                    stageRoleID = role.roleID;
                }
                else
                {
                    if(stage.kind === 'ByDereg')
                    {
                        stageRoleID = mapOfDeregAndRole[stage.dereg];
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
                    stagesToWaitFor: stage.stagesToWaitFor, attachedFilesNames: [],
                    userEmail: stageUserEmail, originStagesToWaitFor: stage.stagesToWaitFor,
                    approvalTime: null, comments: ''
                });
                activeProcessStages.push(activeProcessStage);

            }
            let activeProcessToReturn = new ActiveProcess({
                processName: processName, creatorUserEmail: userEmail,
                processDate: processDate, processUrgency: processUrgency, creationTime: today,
                notificationTime: notificationTime, currentStages: [initialStage], onlineForms: process.onlineForms,
                filledOnlineForms: [], lastApproached: today
            }, activeProcessStages);
            for(let i=0;i<activeProcessToReturn.stages.length;i++)
            {
                let stage = activeProcessToReturn.stages[i];
                if(stage.kind === "ByDereg" && (stage.roleID === null || parseInt(stage.dereg) < startingDereg))
                {
                    for(let j=0;j<stage.stagesToWaitFor.length;j++)
                    {
                        let prevStage = activeProcessToReturn.getStageByStageNum(stage.stagesToWaitFor[j]);
                        prevStage.removeNextStages([stage.stageNum]);
                        prevStage.addNextStages(stage.nextStages);
                    }
                    for(let j=0;j<stage.nextStages.length;j++)
                    {
                        let nextStage = activeProcessToReturn.getStageByStageNum(stage.nextStages[j]);
                        nextStage.removeStagesToWaitFor([stage.stageNum]);
                        nextStage.addStagesToWaitFor(stage.stagesToWaitFor);
                    }
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
 * @param notificationTime | The pre-defined time which notifications will repeat themselves for.
 * @param callback
 */



module.exports.startProcessByUsername = (userEmail, processStructureName, processName, processDate, processUrgency, notificationTime, callback) => {
    usersAndRolesController.getRoleByUsername(userEmail, (err, role) => {
        if (err) {
            callback(err);
        } else {
            processStructureController.getProcessStructure(processStructureName, (err, processStructure) => {
                if (err) {
                    callback(err);
                } else {
                    if (!processStructure.available) {
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
                                getNewActiveProcess(processStructure, role, initialStage, userEmail, processName, processDate, processUrgency, notificationTime, (err,activeProcess)=>{
                                    if(err) callback(err);
                                    else {
                                        processAccessor.createActiveProcess(activeProcess, (err) => {
                                            //TODO Kuti Send Name and not email of creator
                                            processReportController.addProcessReport(processName, activeProcess.creationTime, processDate, processUrgency, userEmail, (err) => {
                                                if (err) {
                                                    callback(err);
                                                } else {
                                                    // Notify first role
                                                    notificationsController.addNotificationToUser(userEmail, new Notification(
                                                        processName + " מסוג " + processStructureName + " מחכה לטיפולך.", "תהליך בהמתנה"), callback);
                                                }
                                            })
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
    usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
        if (err) {
            callback(err);
        } else {
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
    let dirToUpload = dirOfProcess + '/' + userEmail;
    let fileNames = [];
    let flag = true;
    let hasAtLeastOneChecked = false;
    for (let attr in fields) {
        if (!isNaN(attr)) {
            hasAtLeastOneChecked = true;
        }
    }
    if(!hasAtLeastOneChecked)
    {
        callback(null,'unchecked');
        return;
    }
    for (let file in files) {
        if (files[file].name !== "") {
            if (flag) {
                if (!fs.existsSync(dirOfFiles)) {
                    fs.mkdirSync(dirOfFiles);
                }
                if (!fs.existsSync(dirOfProcess)) {
                    fs.mkdirSync(dirOfProcess);
                }
                if (!fs.existsSync(dirToUpload)) {
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
            let currentStage;
            for (let i = 0; i < process.currentStages.length; i++) {
                currentStage = process.getStageByStageNum(process.currentStages[i]);
                if (currentStage.userEmail === userEmail) {
                    break;
                }
            }
            let today = new Date();
            stageDetails.stageNum = currentStage.stageNum;
            stageDetails.action = "continue";
            process.handleStage(stageDetails);
            advanceProcess(process, currentStage.stageNum, stageDetails.nextStageRoles, (err, result) => {
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
                                notificationsController.notifyNotFinishedProcess(process, callback);
                            }
                        });
                    }
                }
            });
        }
    });
}


function getRoleIDsOfNextDeregStages(process, nextStages, callback)
{
    usersAndRolesController.getRoleIdByUsername(process.creatorUserEmail, (err,roleID)=>{
       if(err) callback(err);
       else
       {
           let deregs = [];
           for(let i=0;i<nextStages.length;i++)
           {
               let stage = process.getStageByStageNum(nextStages[i]);
               if(stage.kind === 'ByDereg')
               {
                   deregs.push(stage.dereg);
               }
           }
           usersAndRolesController.getFatherOfDeregByArrayOfRoleIDs(roleID, deregs, callback);
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
    process.advanceProcess(stageNum, nextStages);
    let today = new Date();
    processAccessor.updateActiveProcess({processName: process.processName}, {
        currentStages: process.currentStages, stages: process.stages, lastApproached: today
    }, (err, res) => {
        if (err) callback(new Error(">>> ERROR: advance process | UPDATE"));
        else callback(null, res);
    });
}

module.exports.getAllActiveProcessDetails = (processName, callback) => {
    processReportAccessor.findProcessReport({processName: processName}, (err, processReport) => {
        if (err) callback(err);
        else {
            processReport = processReport._doc;
            let returnProcessDetails = {
                processName: processReport.processName,
                creationTime: processReport.creationTime,
                status: processReport.status,
                urgency: processReport.processUrgency,
                processDate: processReport.processDate,
                filledOnlineForms: processReport.filledOnlineForms
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
                    roleID: roleName,
                    userEmail: stage.userEmail,
                    userName: stage.userName,
                    stageNum: stage.stageNum,
                    approvalTime: stage.approvalTime,
                    comments: stage.comments,
                    files: stage.attachedFilesNames
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
            if (processArray.length === 0) callback(null, null);
            else callback(null, processArray[0]);
        }
    });
}

function getRoleNamesForArray(stages, index, roleNamesArray, callback) {
    if (index === stages.length) {
        callback(null, roleNamesArray);
        return;
    }
    let roleID = stages[index].roleID;
    (function (array, stageNum) {
        usersAndRolesController.getRoleNameByRoleID(roleID, (err, roleName) => {
            if (err) callback(err);
            else {
                array.push([roleName, stageNum]);
                getRoleNamesForArray(stages, index + 1, roleNamesArray, callback);
            }
        });
    })(roleNamesArray, stages[index].stageNum);
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
                getRoleNamesForArray(nextStagesArr, 0, [], (err, rolesNames) => {
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
                processReportController.addActiveProcessDetailsToReport(processName, userEmail, [], stage, today, (err) => {
                    if (err) {
                        callback(err);
                    } else {
                        notificationsController.addNotificationToUser(creatorEmail, new Notification("התהליך " + processName + " חזר אליך", "תהליך חזר ליוצר"), callback);
                    }
                });
            }
        });
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
                    let usersToNotify = process.getParticipatingUsers();
                    processReportController.addActiveProcessDetailsToReport(processName, userEmail, [], stage, today, (err) => {
                        if (err) {
                            callback(err);
                        } else {
                            usersToNotify.reduce((prev, curr) => {
                                return (err) => {
                                    if (err) {
                                        prev(err);
                                    } else {
                                        notificationsController.addNotificationToUser(curr,
                                            new Notification("התהליך " + processName + " בוטל על ידי " + userEmail, "תהליך בוטל"), prev);
                                    }
                                }
                            }, (err) => {
                                if (err) {
                                    console.log(err);
                                    callback(err);
                                } else {
                                    callback(null);
                                }
                            })(null);
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

module.exports.processReport = function (process_name, callback) {
    this.getAllActiveProcessDetails(process_name, (err, result) => {
        if (err) callback(err);
        else {
            result[0].creationTime = moment(result[0].creationTime).format("DD/MM/YYYY HH:mm:ss");
            result[0].processDate = moment(result[0].processDate).format("DD/MM/YYYY HH:mm:ss");
            for (let i = 0; i < result[1].length; i++) {
                result[1][i].approvalTime = moment(result[1][i].approvalTime).format("DD/MM/YYYY HH:mm:ss");
            }
            getFilledOnlineForms(result[0].filledOnlineForms, 0, [], (err, formsArr) => {
                for (let i = 0; i < formsArr.length; i++) {
                    result[0].filledOnlineForms[i] = formsArr[i];
                }
                callback(null, result);
            });
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

/////////
module.exports.getActiveProcessByProcessName = getActiveProcessByProcessName;
module.exports.uploadFilesAndHandleProcess = uploadFilesAndHandleProcess;
module.exports.convertDate = convertDate;
module.exports.getFilledOnlineForms = getFilledOnlineForms;