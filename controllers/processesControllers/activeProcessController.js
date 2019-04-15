let processAccessor = require('../../models/accessors/activeProcessesAccessor');
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
                                let newStages = [];
                                processStructure.stages.forEach((stage) => {
                                    newStages.push({
                                        roleID: role.roleID,
                                        kind: stage.kind,
                                        dereg: stage.dereg,
                                        userEmail: stage.stageNum === initialStage ? userEmail : null,
                                        stageNum: stage.stageNum,
                                        nextStages: stage.nextStages,
                                        stagesToWaitFor: stage.stageNum === initialStage ? [] : stage.stagesToWaitFor,
                                        originStagesToWaitFor: stage.stagesToWaitFor,
                                        approvalTime: null,
                                        attachedFilesNames: [],
                                    });
                                });
                                let today = new Date();
                                processAccessor.createActiveProcess({
                                    creatorUserEmail: userEmail,
                                    startingMador: role.mador,
                                    creationTime: today,
                                    notificationTime: notificationTime,
                                    currentStages: [initialStage],
                                    processName: processName,
                                    stages: newStages,
                                    lastApproached: today,
                                    processDate: processDate,
                                    processUrgency: processUrgency,
                                    processCreatorEmail: userEmail,
                                    onlineForms: processStructure.onlineForms,
                                    filledOnlineForms: []
                                }, (err) => {
                                    if (err) callback(err);
                                    else processReportController.addProcessReport(processName, today, processDate, processUrgency, userEmail, (err) => {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            // Notify first role
                                            notificationsController.addNotificationToUser(userEmail, new Notification(
                                                processName + " מסוג " + processStructureName + " מחכה לטיפולך.", "תהליך בהמתנה"), callback)
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
                bringRoles([], [], 0, 0, activeProcesses, (err, arrayOfRoles) => {
                    callback(null, [waitingActiveProcesses, arrayOfRoles]);
                });
            } else {
                callback(null, [waitingActiveProcesses, []]);
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

function bringRoles(subArray, fullArray, i, j, activeProcesses, callback) {
    if (i === activeProcesses.length) {
        callback(null, fullArray);
        return;
    }
    if (j === activeProcesses[i].currentStages.length) {
        fullArray.push(subArray);
        bringRoles([], fullArray, i + 1, 0, activeProcesses, callback);
        return;
    }
    let currentStageNumber = activeProcesses[i].currentStages[j];
    let currentStage = activeProcesses[i].stages[currentStageNumber];
    let roleID = currentStage.roleID;
    (function (variable) {
        usersAndRolesController.getRoleNameByRoleID(roleID, (err, roleName) => {
            if (err) callback(err);
            else {
                variable.push(roleName);
                bringRoles(subArray, fullArray, i, j + 1, activeProcesses, callback);
            }
        });
    })(subArray);
}

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
                            bringRoles([], [], 0, 0, activeProcesses, (err, arrayOfRoles) => {
                                callback(null, [toReturnActiveProcesses, arrayOfRoles, userEmailsArrays]);
                            });
                        } else {
                            callback(null, [toReturnActiveProcesses, [], []]);
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
                                    if (err) {
                                        callback(err);
                                    } else {
                                        // notifying participants
                                        process.stages.reduce((prev, curr) => {
                                            return (err) => {
                                                if (err) {
                                                    prev(err);
                                                } else {
                                                    notificationsController.addNotificationToUser(curr.userEmail,
                                                        new Notification("התהליך" + process.processName + " הושלם בהצלחה", "תהליך נגמר בהצלחה"), prev)
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
                    } else {
                        processReportController.addActiveProcessDetailsToReport(processName, userEmail, stageDetails, today, (err) => {
                            if (err) {
                                callback(err);
                            } else {
                                process.currentStages.reduce((acc, curr) => {
                                    return (err) => {
                                        if (err) {
                                            acc(err);
                                        } else {
                                            let stage = process.getStageByStageNum(curr);
                                            usersAndRolesController.getEmailsByRoleId(stage.roleID, (err, emails) => {
                                                emails.reduce((acc, curr) => {
                                                    return (err) => {
                                                        if (err) {
                                                            acc(err);
                                                        } else {
                                                            notificationsController.addNotificationToUser(curr, new Notification("התהליך " + process.processName + " מחכה ברשימת התהליכים הזמינים לך", "תהליך זמין"), acc);
                                                        }
                                                    }
                                                }, (err) => {
                                                    if (err) {
                                                        acc(err);
                                                    } else {
                                                        acc(null);
                                                    }
                                                })(null);
                                            });
                                        }
                                    }
                                }, (err) => {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        callback(null);
                                    }
                                })(null);
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
    getRoleIDsOfNextDeregStages(process,nextStages,(err, mapOfRoleIDs)=>{
       if(err) callback(err);
       else
       {
           process.advanceProcess(stageNum, nextStages, mapOfRoleIDs);
           let today = new Date();
           processAccessor.updateActiveProcess({processName: process.processName}, {
               currentStages: process.currentStages, stages: process.stages, lastApproached: today
           }, (err, res) => {
               if (err) callback(new Error(">>> ERROR: advance process | UPDATE"));
               else callback(null, res);
           });
       }
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
                        onlineFormController.findOnlineFormsNamesByFormsIDs(process._onlineForms, (err, onlineFormsNames) => {
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
            creationTime = array[i]._creationTime;
            lastApproached = array[i]._lastApproached;
        } else {
            creationTime = array[i];
            lastApproached = array[i];
        }
        creationTime = moment(creationTime).format("DD/MM/YYYY HH:mm:ss");
        lastApproached = moment(lastApproached).format("DD/MM/YYYY HH:mm:ss");
        if (isArrayOfDates === undefined) {
            array[i]._creationTime = creationTime;
            array[i]._lastApproached = lastApproached;
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