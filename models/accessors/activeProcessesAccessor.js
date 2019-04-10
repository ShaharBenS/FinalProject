let ActiveProcess = require('../../domainObjects/activeProcess');
let ActiveProcessStage = require('../../domainObjects/activeProcessStage');
let activeProcessSchema = require('../schemas/processesSchemas/ActiveProcessSchema.js');

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

module.exports.getActiveProcesses = (callback)=>{
    return activeProcessSchema.find({},callback);
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

module.exports.updateAllActiveProcesses = (AP, update, callback) => {
    return activeProcessSchema.updateMany(AP, update, callback);
};

/*********************/
/* Private Functions */
/*********************/

let getActiveProcessFromOriginal = function (activeProcess) {
    return new ActiveProcess(activeProcess,getActiveProcessStagesFromOriginal(activeProcess.stages));
};


let getActiveProcessStagesFromOriginal = function (stages) {
    let newStages = [];
    stages.forEach((stage) => {
        newStages.push(new ActiveProcessStage(stage));
    });
    return newStages;
};