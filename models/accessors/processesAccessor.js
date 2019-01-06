let activeProcess = require('../../domainObjects/activeProcess');
let activeProcessStage = require('../../domainObjects/activeProcessStage');
let processStructure = require('../schemas/processesSchemas/ProcessStructureSchema.js');
let processReport = require('../schemas/processesSchemas/ProcessReportSchema.js');

/* processStructure */

module.exports.createProcessStructure = (PS, callback) =>
{
    return processStructure.create(PS, callback);
};

module.exports.findProcessStructure = (PS, callback) =>
{
    return processStructure.find(PS, callback);
};

module.exports.deleteOneProcessStructure = (PS, callback) =>
{
    return processStructure.deleteOne(PS, callback);
};

module.exports.updateProcessStructure = (PS, update, callback) =>
{
    return processStructure.updateOne(PS, update, callback);
};

/* activeProcess */

module.exports.getActiveProcessByProcessName = (processName, callback) =>
{
    activeProcess.find({processName: processName}, (err, process) =>
    {
        let processObj;
        if (err) callback(err);
        else {
            if (process.length === 0) callback(null, null);
            else {
                processObj = new activeProcess(process.processName, process.timeCreation, process.notificationTime, process.currentStages, process.initials, []);
                process.stages.forEach((stage) =>
                {
                    processObj.stages.push(
                        new activeProcessStage(
                            stage.roleID,
                            stage.userEmail,
                            stage.stageNum,
                            stage.nextStages,
                            stage.stagesToWaitFor,
                            stage.originStagesToWaitFor,
                            stage.timeApproval,
                            stage.onlineForms,
                            stage.filledOnlineForms,
                            stage.attachedFilesNames,
                            stage.comments))
                })
            }
            callback(null, processObj);
        }
    });
};

module.exports.createActiveProcess = (AP, callback) =>
{
    return activeProcess.create(AP, callback);
};

module.exports.findActiveProcess = (AP, callback) =>
{
    return activeProcess.find(AP, callback);
};

module.exports.deleteOneActiveProcess = (AP, callback) =>
{
    return activeProcess.deleteOne(AP, callback);
};

module.exports.updateActiveProcess = (AP, update, callback) =>
{
    return activeProcess.updateOne(AP, update, callback);
};

/* processReport */
module.exports.createProcessReport = (PR, callback) =>
{
    return processReport.create(PR, callback);
};

module.exports.findProcessReport = (PR, callback) =>
{
    return processReport.find(PR, callback);
};

module.exports.deleteOneProcessReport = (PR, callback) =>
{
    return processReport.deleteOne(PR, callback);
};

module.exports.updateProcessReport = (PR, update, callback) =>
{
    return processReport.updateOne(PR, update, callback);
};