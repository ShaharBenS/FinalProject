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
 * @param processDate | The requested date for the active process
 * @param processUrgency | The requested urgency for the active process
 * @param notificationTime | The pre-defined time which notifications will repeat themselves for.
 * @param callback
 */

module.exports.startProcessByUsername = (userEmail, processStructureName, processName, processDate, processUrgency, notificationTime, callback) => {
    usersAndRolesController.getUserByEmail(userEmail,(err,user)=>{
        if(err) callback(err);
        else
        {
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                if (err) {
                    callback(err);
                } else {
                    processStructureController.getProcessStructure(processStructureName, (err, processStructure) => {
                        if (err) {
                            callback(err);
                        } else {
                            if (!processStructure.available) {
                                callback(new Error('This process structure is currently unavailable due to changes in roles'));
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
                                                role: stage.roleID,
                                                user: stage.stageNum === initialStage ? user._id : null,
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
                                            creatorRole: roleID,
                                            creationTime: today,
                                            notificationTime: notificationTime,
                                            currentStages: [initialStage],
                                            processName: processName,
                                            initials: processStructure.initials,
                                            stages: newStages,
                                            lastApproached: today,
                                            processDate: processDate,
                                            processUrgency: processUrgency
                                        }, (err) => {
                                            if (err) callback(err);
                                            else processReportController.addProcessReport(processName, today, processDate, processUrgency, userEmail, (err) => {
                                                if (err) {
                                                    callback(err);
                                                } else {
                                                    // Notify first role
                                                    notificationsController.addNotificationToUser(userEmail, new Notification(
                                                        processName+" מסוג "+processStructureName+" מחכה לטיפולך.","תהליך בהמתנה"), callback)
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
        if (err) callback(err);
        else {
            let waitingActiveProcesses = [];
            processAccessor.findActiveProcesses({}, (err, activeProcesses) => {
                if (err) callback(err);
                else {
                    if (activeProcesses !== null) {
                        activeProcesses.forEach((process) => {
                            if (process.isWaitingForUser(roleID, userEmail)) {
                                waitingActiveProcesses.push(process);
                            }
                        });

                    }
                    callback(null, waitingActiveProcesses);
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

function getActiveProcessesOfChildren(activeProcesses, children, userEmail)
{
    let toReturnActiveProcesses = [];
    let userEmailsArrays = [];
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
                }
                else {
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
    return [toReturnActiveProcesses, userEmailsArrays]
}


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
                        if (activeProcesses !== null) {
                            let processOfChildrenWithChildren = getActiveProcessesOfChildren(activeProcesses, children, userEmail);
                            let arrayToSend = [];
                            for(let i=0;i<processOfChildrenWithChildren[0].length;i++)
                            {
                                let process = processOfChildrenWithChildren[0][i];
                                let currentStagesOfProcess = [];
                                process._currentStages.forEach((curr)=>{
                                    let stage = process.getStageByStageNum(curr);
                                    currentStagesOfProcess.push({userEmail: stage.user !== null?stage.user.userEmail:null, roleName: stage.role.roleName});
                                });
                                arrayToSend.push({processName: process._processName, processUrgency: process._processUrgency,
                                    processDate: moment(process._processDate).format("DD/MM/YYYY HH:mm:ss"), children: processOfChildrenWithChildren[1][i],
                                    lastApproached: moment(process._lastApproached).format("DD/MM/YYYY HH:mm:ss"), currentStages: currentStagesOfProcess});
                            }
                            callback(null, arrayToSend);
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
    let formsInfo = JSON.parse(fields.formsInfo);
    let stage = {
        comments: fields.comments,
        filledForms: formsInfo,
        fileNames: fileNames,
        nextStageRoles: nextStageRoles
    };
    handleProcess(userEmail, processName, stage, callback);
}

function createOnlineFormsFromArray(forms, index, formIdArray, callback) {
    if (index === forms.length) {
        callback(null, formIdArray);
        return;
    }
    let form = forms[index];
    (function (array, form) {
        filledOnlineFormController.createFilledOnlineFrom(form.formName, form.fields, (err, formRecord) => {
            if (err) callback(err);
            else {
                array.push(formRecord._id);
                createOnlineFormsFromArray(forms, index + 1, formIdArray, callback);
            }
        });
    })(formIdArray, form);
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
                if (currentStage.user.userEmail === userEmail) {
                    break;
                }
            }
            createOnlineFormsFromArray(stageDetails.filledForms, 0, [], (err, filledFormsIDs) => {
                let today = new Date();
                stageDetails.filledForms = filledFormsIDs;
                stageDetails.stageNum = currentStage.stageNum;
                stageDetails.action = "continue";
                process.handleStage(stageDetails);
                advanceProcess(process, currentStage.stageNum, stageDetails.nextStageRoles, (err, result) => {
                    if (err) callback(err);
                    else {
                        if (process.isFinished()) {
                            stageDetails.status = "הושלם";
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
                                                        notificationsController.addNotificationToUser(curr.user.userEmail,
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
                                        return (err)=>{
                                            if(err){
                                                acc(err);
                                            }
                                            else{
                                                let stage = process.getStageByStageNum(curr);
                                                usersAndRolesController.getEmailsByRoleId(stage.role.id,(err,emails)=>{
                                                    emails.reduce((acc,curr)=>{
                                                        return (err)=>{
                                                            if(err){
                                                                acc(err);
                                                            }
                                                            else{
                                                                notificationsController.addNotificationToUser(curr,new Notification("התהליך "+process.processName+" מחכה ברשימת התהליכים הזמינים לך","תהליך זמין"),acc);
                                                            }
                                                        }
                                                    },(err)=>{
                                                        if(err){
                                                            acc(err);
                                                        }
                                                        else{
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
    process.advanceProcess(stageNum, nextStages);
    let today = new Date();
    processAccessor.updateActiveProcess({processName: process.processName}, {
        currentStages: process.currentStages, stages: process.stages, lastApproached: today
    }, (err, res) => {
        if (err) callback(new Error(">>> ERROR: advance process | UPDATE"));
        else callback(null, res);
    });
}

module.exports.takePartInActiveProcess = (processName, userEmail, callback) => {
    usersAndRolesController.getUserByEmail(userEmail,(err,user)=>{
        if (err) callback(err);
        else {
            processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
                if (err) callback(err);
                else {
                    usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                        if (err) callback(err);
                        else {
                            let stageNum = process.assignUserToStage(roleID, user);
                            processAccessor.updateStageWithUserActiveProcess(processName, stageNum, user._id, callback);
                        }
                    });
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

module.exports.getNextStagesRolesAndOnlineForms = function (processName, userEmail, callback) {
    getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            if (!process) {
                callback(new Error("Couldn't find process"));
            } else {
                let currentStage = process.getStageByStageNum(process.getCurrentStageNumberForUser(userEmail));
                let nextRolesNames = [], onlineForms = [];
                for (let j = 0; j < currentStage.nextStages.length; j++) {
                    let stage = process.getStageByStageNum(currentStage.nextStages[j]);
                    nextRolesNames.push([stage.role.roleName,stage.stageNum]);
                }
                for(let j=0;j<currentStage.onlineForms.length;j++)
                {
                    onlineForms.push(currentStage.onlineForms[j].formName);
                }
                callback(null, [nextRolesNames, onlineForms]);
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
            filledForms: [],
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
                stageNum: process.getCurrentStageNumberForUser(userEmail),
                status: "מבוטל"
            };
            processAccessor.deleteOneActiveProcess({processName: processName}, (err) => {
                if (err) callback(err);
                else {
                    let usersToNotify = process.getParticipatingUsers();
                    processReportController.addActiveProcessDetailsToReport(processName, userEmail, stage, today, (err) => {
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

module.exports.processReport = function (processName, callback) {
    processReportAccessor.findProcessReport({processName: processName}, (err, processReport) => {
        if (err) callback(err);
        else {
            processReport.creationTime = moment(processReport.creationTime).format("DD/MM/YYYY HH:mm:ss");
            processReport.processDate = moment(processReport.processDate).format("DD/MM/YYYY HH:mm:ss");
            for (let i = 0; i < processReport.stages.length; i++) {
                processReport.stages[i].approvalTime = moment(processReport.stages.approvalTime).format("DD/MM/YYYY HH:mm:ss");
            }
            callback(null, processReport);
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