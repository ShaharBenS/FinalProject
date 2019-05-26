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


function getRoleIDsOfDeregStages(stages, userEmail, callback) {
    usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
        if (err) callback(err);
        else {
            let deregs = [];
            for (let i = 0; i < stages.length; i++) {
                let stage = stages[i];
                if (stage.kind === 'ByDereg' && !deregs.includes(stage.dereg)) {
                    deregs.push(stage.dereg);
                }
            }
            usersAndRolesController.getFatherOfDeregByArrayOfRoleIDs(roleID, deregs, callback);
        }
    });
}

function getNewActiveProcess(processStructure, role, initialStage, userEmail, processName, processDate, processUrgency, notificationTime, callback) {
    let today = new Date();
    getRoleIDsOfDeregStages(processStructure.stages, userEmail, (err, mapOfDeregAndRole) => {
        if (err) callback(err);
        else {
            let activeProcessStages = [];
            let startingDereg = parseInt(role.dereg);
            for (let i = 0; i < processStructure.stages.length; i++) {
                let stage = processStructure.stages[i];
                let stageRoleID = stage.roleID;
                let stageUserEmail = null;
                let assignmentTime = null;
                let stagesToWaitFor = processStructure.stages[i].stagesToWaitFor;
                if (stage.stageNum === initialStage) {
                    stageUserEmail = userEmail;
                    stageRoleID = role.roleID;
                    assignmentTime = today;
                    stagesToWaitFor = [];
                }
                else {
                    if (stage.kind === 'ByDereg') {
                        if (stage.dereg === role.dereg) {
                            stageUserEmail = userEmail;
                            stageRoleID = role.roleID;
                        }
                        else {
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
                    stagesToWaitFor: stagesToWaitFor,
                    originStagesToWaitFor: stagesToWaitFor.slice(),
                    userEmail: stageUserEmail,
                    approvalTime: null, assignmentTime: assignmentTime, notificationsCycle: 1
                });
                activeProcessStages.push(activeProcessStage);

            }
            let activeProcessToReturn = new ActiveProcess({
                processName: processName,
                creatorUserEmail: userEmail,
                processDate: processDate,
                processUrgency: processUrgency,
                creationTime: today,
                notificationTime: notificationTime,
                automaticAdvanceTime: processStructure.automaticAdvanceTime,
                currentStages: [initialStage],
                onlineForms: processStructure.onlineForms,
                filledOnlineForms: [],
                lastApproached: today,
                stageToReturnTo: initialStage
            }, activeProcessStages);
            let initialStages = activeProcessToReturn.stages.filter((stage)=>stage.stagesToWaitFor.length === 0);
            while(initialStages.length !== 0)
            {
                let stage = initialStages.shift();
                if (stage.kind === "ByDereg" && (stage.roleID === null || parseInt(stage.dereg) < startingDereg)) {
                    activeProcessToReturn.removeStage(stage.stageNum);
                    initialStages = activeProcessToReturn.stages.filter((stage)=>stage.stagesToWaitFor.length === 0);
                    continue;
                }
                for(let i=0;i<stage.nextStages.length;i++)
                {
                    let nextStage = activeProcessToReturn.getStageByStageNum(stage.nextStages[i]);
                    if(nextStage.userEmail !== null && stage.userEmail === nextStage.userEmail)
                    {
                        activeProcessToReturn.removeStage(nextStage.stageNum);
                        initialStages = activeProcessToReturn.stages.filter((stage)=>stage.stagesToWaitFor.length === 0);
                        break;
                    }
                    initialStages.push(activeProcessToReturn.getStageByStageNum(nextStage.stageNum));
                }
            }
            /*
            for (let i = 0; i < activeProcessToReturn.stages.length; i++) {
                let stage = activeProcessToReturn.stages[i];
                if (stage.kind === "ByDereg" && (stage.roleID === null || parseInt(stage.dereg) < startingDereg)) {
                    activeProcessToReturn.removeStage(stage.stageNum);
                    i--;
                }
                if(stage.userEmail === lastUserEmail)
                {
                    activeProcessToReturn.removeStage(stage.stageNum);
                    i--;
                }
                lastUserEmail = stage.userEmail;
            }*/
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
                        callback(null,'מבנה התהליך שנבחר אינו קיים או אינו זמין עקב שינויים בעץ המשתמשים');
                        return;
                    }
                    processAccessor.getActiveProcessByProcessName(processName, (err, activeProcesses) => {
                        if (err) {
                            callback(err);
                        } else {
                            if (activeProcesses === null) {
                                let initialStage = processStructure.getInitialStageByRoleID(role.roleID, role.dereg);
                                if (initialStage === -1) {
                                    callback(null, 'אינך רשאי להתחיל תהליך זה מכיוון שאינך נמצא בשלבי מבנה התהליך');
                                    return;
                                }
                                getNewActiveProcess(processStructure, role, initialStage, userEmail, processName, processDate, processUrgency, processStructure.notificationTime, (err, activeProcess) => {
                                    if (err) callback(err);
                                    else {
                                        processAccessor.createActiveProcess(activeProcess, (err) => {
                                            if (err) callback(err);
                                            else {
                                                processReportController.addProcessReport(processName, activeProcess.creationTime, processDate, processUrgency, userEmail, (err) => {
                                                    if (err) {
                                                        callback(err);
                                                    } else {
                                                        // Notify first role
                                                        notificationsController.addNotificationToUser(userEmail, new Notification(
                                                            processName + " מסוג " + processStructureName + " מחכה לטיפולך.", "תהליך בהמתנה"), (err)=>{
                                                            if(err) callback(err);
                                                            else callback(null, 'success');
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            } else {
                                callback(null, 'קיים תהליך בשם זה.אנא בחר שם אחר להתהליך החדש');
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

function uploadFilesAndHandleProcess(userEmail, fields, files, dirOfFiles, callback) {
    let processName = fields.processName;
    processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            let foundStage = null;
            for (let i = 0; i < process.currentStages.length; i++) {
                let currentStage = process.getStageByStageNum(process.currentStages[i]);
                if(currentStage instanceof Error) {
                    callback(currentStage);
                    return;
                }
                if (currentStage.userEmail === userEmail) {
                    foundStage = currentStage;
                    break;
                }
            }
            if (foundStage === null) {
                callback(null, 'אינך רשאי לטפל בתהליך זה מכיוון שאינך כלול בשלבים הנוכחיים של התהליך');
                return;
            }
            let nextStageRoles = [];
            for (let attr in fields) {
                if (fields.hasOwnProperty(attr) && !isNaN(attr)) {
                    nextStageRoles.push(parseInt(attr));
                }
            }
            for (let i = 0; i < nextStageRoles.length; i++) {
                if (!foundStage.nextStages.includes(nextStageRoles[i])) {
                    callback(null, 'אחד או יותר המתפקידים הבאים שנבחרו לשלבים הבאים שגויים');
                    return;
                }
            }
            if (nextStageRoles.length === 0 && foundStage.nextStages.length !== 0) {
                callback(null, 'לא סומנו תפקידים לשלב הבא');
                return;
            }
            let today = new Date();
            handleProcess(userEmail, process, foundStage, nextStageRoles, today, (err,result)=>{
                if(err) callback(err);
                else
                {
                    let fileNames = uploadFiles(processName,dirOfFiles,files);
                    let stageDetailsForReport = {comments: fields.comments,
                        fileNames: fileNames,stageNum: foundStage.stageNum,
                        action: 'continue'
                    };
                    processReportController.addActiveProcessDetailsToReport(processName, userEmail, stageDetailsForReport, today, (err,result)=>{
                        if(err) callback(err);
                        else
                        {
                            callback(null, 'success');
                        }
                    });
                }
            });
        }
    });
}

function uploadFiles(processName, dirOfFiles, files){
    let dirOfProcess = dirOfFiles + '/' + processName;
    let fileNames = [];
    let flag = true;
    for (let file in files) {
        if(files.hasOwnProperty(file))
        {
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
                try{
                    fs.renameSync(oldpath, newpath);
                }catch (e) {
                    console.log(e);
                }
            }
        }
    }
    return fileNames;
}

/**
 * approving process and updating stages
 *
 * @param userEmail | the user that approved
 * @param process | the process name that approved
 * @param currentStage | stage of userEmail in process
 * @param nextStageRoles
 * @param nowDate
 * @param callback
 */
function handleProcess(userEmail, process, currentStage, nextStageRoles, nowDate, callback) {
    let result = process.handleStage(currentStage.stageNum);
    if(result instanceof Error) callback(result);
    advanceProcess(process, currentStage.stageNum, nextStageRoles, nowDate, (err, newlyAddedStages) => {
        if (err) callback(err);
        else {
            if (process.isFinished()) {
                processAccessor.deleteOneActiveProcess({processName: process.processName}, (err) => {
                    if (err) callback(err);
                    else {
                        notificationsController.notifyFinishedProcess(process, callback);
                    }
                });
            } else {
                notificationsController.notifyNotFinishedProcess(process, newlyAddedStages, callback);
            }
        }
    });
}


function assignSingleUsersToStages(process, newlyAddedStages, callback) {
    let roleIDs = [];
    newlyAddedStages.forEach(curr => {
        let stage = process.getStageByStageNum(curr);
        if(stage instanceof Error) callback(stage);
        if (stage.userEmail === null) roleIDs.push(stage.roleID);
    });
    usersAndRolesController.findRolesByArray(roleIDs, (err, roles) => {
        if (err) callback(err);
        else {
            roles.forEach(role => {
                if (role.userEmail.length === 1) {
                    let result = process.assignUserToStage(role._id, role.userEmail[0]);
                    if(result instanceof Error) callback(result);
                }
            });
            callback(null, process);
        }
    });
}

/**
 * Advance process to next stage if able
 *
 * @param process
 * @param stageNum
 * @param nextStages
 * @param nowDate
 * @param callback
 */
function advanceProcess(process, stageNum, nextStages, nowDate, callback) {
    let addedCurrentStages = process.advanceProcess(stageNum, nextStages);
    if(addedCurrentStages instanceof Error) callback(addedCurrentStages);
    assignSingleUsersToStages(process, addedCurrentStages, (err, process) => {
        if (err) callback(err);
        else {
            processAccessor.updateActiveProcess({processName: process.processName}, {
                currentStages: process.currentStages, stages: process.stages, lastApproached: nowDate,
                stageToReturnTo: process.stageToReturnTo
            }, (err, res) => {
                if (err) callback(err);
                else {
                    callback(null, addedCurrentStages);
                }
            });
        }
    });
}

module.exports.takePartInActiveProcess = (userEmail, processID, callback) => {
    getActiveProcessByProcessID(processID, (err, process) => {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                if (err) callback(err);
                else {
                    let result = process.assignUserToStage(roleID, userEmail);
                    if(result instanceof Error) callback(result);
                    processAccessor.updateActiveProcess({processName: process.processName}, {stages: process.stages}, callback);
                }
            });
        }
    });
};

module.exports.unTakePartInActiveProcess = (userEmail, processID, callback) => {
    getActiveProcessByProcessID(processID, (err, process) => {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                if (err) callback(err);
                else {
                    let result = process.unAssignUserToStage(roleID, userEmail);
                    if(result instanceof Error) callback(result);
                    processAccessor.updateActiveProcess({processName: process.processName}, {stages: process.stages}, callback);
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

function getActiveProcessByProcessID(processID, callback) {
    processAccessor.findActiveProcesses({_id: processID}, (err, processArray) => {
        if (err) callback(err);
        else {
            if (processArray === null || processArray.length === 0) callback(null, null);
            else callback(null, processArray[0]);
        }
    });
}

module.exports.getNextStagesRolesAndOnlineForms = function (processID, userEmail, callback) {
    getActiveProcessByProcessID(processID, (err, process) => {
        if (err) callback(err);
        else {
            if (!process) {
                callback(new Error("Couldn't find process"));
            } else {
                let foundStage = null;
                for (let i = 0; i < process.currentStages.length; i++) {
                    let currentStage = process.getStageByStageNum(process.currentStages[i]);
                    if(currentStage instanceof Error) callback(currentStage);
                    if (currentStage.userEmail === userEmail) {
                        foundStage = currentStage;
                        break;
                    }
                }
                if(foundStage === null)
                {
                    callback(new Error('GetNextStagesRolesAndOnlineForms: user not found in current stages'));
                    return;
                }
                let nextStagesArr = [];
                for (let j = 0; j < foundStage.nextStages.length; j++) {
                    let stageToPush = process.getStageByStageNum(foundStage.nextStages[j]);
                    if(stageToPush instanceof Error) callback(stageToPush);
                    nextStagesArr.push(stageToPush);
                }
                usersAndRolesController.getRoleNamesForArray(nextStagesArr, 0, [], (err, rolesNames) => {
                    if (err) callback(err);
                    else {
                        onlineFormController.findOnlineFormsNamesByFormsIDs(process.onlineForms, (err, onlineFormsNames) => {
                            if (err) callback(err);
                            else {
                                callback(null, [rolesNames, onlineFormsNames, process.processName, process.processID]);
                            }
                        });
                    }
                });
            }
        }
    });
};

module.exports.returnToCreator = function (userEmail, processID, comments, callback) {
    getActiveProcessByProcessID(processID, (err, process) => {
        if(err) callback(err);
        else
        {
            if(process.getCurrentStageNumberForUser(userEmail) === -1)
            {
                callback(new Error('Return To Creator: wrong userEmail'));
                return;
            }
            let creatorEmail = process.returnProcessToCreator();
            if(creatorEmail instanceof Error) callback(creatorEmail);
            let today = new Date();
            let currentNumberForUser = process.getCurrentStageNumberForUser(userEmail);
            if(currentNumberForUser instanceof Error) callback(currentNumberForUser);
            let stage = {
                comments: comments,
                fileNames: [],
                action: "return",
                stageNum: currentNumberForUser
            };
            processAccessor.updateActiveProcess({processName: process.processName}, {
                currentStages: process.currentStages,
                stages: process.stages,
                lastApproached: today
            }, (err) => {
                if (err) callback(err);
                else {
                    processReportController.addActiveProcessDetailsToReport(process.processName, userEmail, stage, today, (err) => {
                        if (err) {
                            callback(err);
                        } else {
                            notificationsController.addNotificationToUser(creatorEmail, new Notification("התהליך " + process.processName + " חזר אליך", "תהליך חזר ליוצר"), callback);
                        }
                    });
                }
            });
        }
    });
};

module.exports.cancelProcess = function (userEmail, processID, comments, callback) {
    getActiveProcessByProcessID(processID, (err, process) => {
        if (err) callback(err);
        else {
            let today = new Date();
            let currentNumberForUser = process.getCurrentStageNumberForUser(userEmail);
            if(currentNumberForUser instanceof Error) callback(currentNumberForUser);
            let stage = {
                comments: comments,
                filledForms: [],
                fileNames: [],
                action: "cancel",
                stageNum: currentNumberForUser
            };
            processAccessor.deleteOneActiveProcess({_id: processID}, (err) => {
                if (err) callback(err);
                else {
                    processReportController.addActiveProcessDetailsToReport(process.processName, userEmail, stage, today, (err) => {
                        if (err) {
                            callback(err);
                        } else {
                            notificationsController.notifyCancelledProcess(process, callback);
                        }
                    });
                }
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

module.exports.incrementStageCycle = (processName, stageNumbers, callback) => {
    processAccessor.getActiveProcessByProcessName(processName, (err, process) => {
        if (err) callback(err);
        else {
            let result = process.incrementNotificationsCycle(stageNumbers);
            if(result instanceof Error) callback(result);
            processAccessor.updateActiveProcess({processName: processName}, {stages: process.stages}, callback);
        }
    })
};

function advanceProcessForUsers(process, stagesToAdvance)
{
    if(stagesToAdvance.length !== 0)
    {
        let stage = stagesToAdvance[0];
        this.handleProcess(stage.userEmail, process, stage, stage.nextStages, new Date(), (err)=>{
            if(err) console.log(err);
        });
    }

}

module.exports.advanceProcessesIfTimeHasPassed = ()=>{
    this.getAllActiveProcesses((err, activeProcesses) =>
    {
        if (err) {
            console.log(err);
        }
        else {
            activeProcesses.forEach(activeProcess =>
            {
                if(activeProcess.automaticAdvanceTime !== 0)
                {
                    let stagesToAdvance = [];
                    activeProcess.currentStages.forEach(curr =>
                    {
                        let currStage = activeProcess.getStageByStageNum(curr);
                        if(currStage instanceof Error) {
                            console.log(currStage);
                            return;
                        }
                        let timePassedInHours = ((new Date()) - currStage.assignmentTime) / 36e5;
                        if (timePassedInHours > activeProcess.automaticAdvanceTime) {
                            stagesToAdvance.push(currStage.userEmail);
                        }
                    });
                    advanceProcessForUsers(activeProcess, stagesToAdvance);
                }
            });
        }
    })
};


module.exports.replaceRoleIDWithRoleNameAndUserEmailWithUserName = replaceRoleIDWithRoleNameAndUserEmailWithUserName;
module.exports.getActiveProcessByProcessName = getActiveProcessByProcessName;
module.exports.uploadFilesAndHandleProcess = uploadFilesAndHandleProcess;
module.exports.convertDate = convertDate;
module.exports.assignSingleUsersToStages = assignSingleUsersToStages;
module.exports.handleProcess = handleProcess;
module.exports.advanceProcess = advanceProcess;
module.exports.getRoleIDsOfDeregStages = getRoleIDsOfDeregStages;
module.exports.getNewActiveProcess = getNewActiveProcess;
module.exports.uploadFiles = uploadFiles;
module.exports.getActiveProcessByProcessID = getActiveProcessByProcessID;