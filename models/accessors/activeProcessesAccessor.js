let ActiveProcess = require('../../domainObjects/activeProcess');
let ActiveProcessStage = require('../../domainObjects/activeProcessStage');
let activeProcessSchema = require('../schemas/processesSchemas/ActiveProcessSchema.js');
let processReportSchema = require('../schemas/processesSchemas/ProcessReportSchema.js');

module.exports.getActiveProcessByProcessName = (processName, callback) => {
    activeProcessSchema.findOne({processName: processName}, (err, process) => {
        if (err)
            callback(err);
        else {
            if (process)
                callback(null, getActiveProcessFromOriginal(process));
            else
                callback(null, null);
        }
    });
};

module.exports.createActiveProcess = (AP, callback) => {
    return activeProcessSchema.create(AP, callback);
};

module.exports.findActiveProcesses = (AP, callback) => {
    return activeProcessSchema.find(AP, (err, activeProcessArray) => {
        if (err)
            callback(err);
        else {
            if (activeProcessArray.length > 0) {
                let newActiveProcessArray = [];
                activeProcessArray.forEach((process) => {
                    newActiveProcessArray.push(getActiveProcessFromOriginal(process));
                });
                callback(null, newActiveProcessArray);
            } else
                callback(null, null);
        }
    });
};

module.exports.deleteOneActiveProcess = (AP, callback) => {
    return activeProcessSchema.deleteOne(AP, callback);
};

module.exports.updateActiveProcess = (AP, update, callback) => {
    return activeProcessSchema.updateOne(AP, update, callback);
};

/* processReport */
module.exports.createProcessReport = (PR, callback) => {
    return processReportSchema.create(PR, callback);
};

module.exports.findProcessReport = (PR, callback) => {
    return processReportSchema.find(PR, callback);
};

module.exports.deleteOneProcessReport = (PR, callback) => {
    return processReportSchema.deleteOne(PR, callback);
};

module.exports.updateProcessReport = (PR, update, callback) => {
    return processReportSchema.updateOne(PR, update, callback);
};


/*********************/
/* Private Functions */
/*********************/

let getActiveProcessFromOriginal = function (activeProcess) {
    return new ActiveProcess(activeProcess.processName,
        activeProcess.creationTime,
        activeProcess.notificationTime,
        activeProcess.currentStages,
        activeProcess.initials,
        getActiveProcessStagesFromOriginal(activeProcess.stages),
        activeProcess.lastApproached);
};


let getActiveProcessStagesFromOriginal = function (stages) {
    let newStages = [];
    stages.forEach((stage) => {
        newStages.push(new ActiveProcessStage(
            stage.roleID,
            stage.userEmail,
            stage.stageNum,
            stage.nextStages,
            stage.stagesToWaitFor,
            stage.originStagesToWaitFor,
            stage.approvalTime,
            stage.onlineForms,
            stage.filledOnlineForms,
            stage.attachedFilesNames,
            stage.comments));
    });
    return newStages;
};