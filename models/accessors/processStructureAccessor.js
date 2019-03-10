let ProcessStructure = require('../../domainObjects/processStructure');
let ProcessStructureStage = require('../../domainObjects/processStructureStage');
let processStructureSchema = require('../schemas/processesSchemas/ProcessStructureSchema.js');

module.exports.createProcessStructure = (newProcessStructure, callback) => {
    processStructureSchema.create(newProcessStructure, callback);
};

module.exports.findProcessStructure = (criteria, callback) => {
    processStructureSchema.findOne(criteria, (err, result) => {
        if (err) {
            callback(err);
        } else {
            if (result === null || result.length === 0) callback(null, null);
            else callback(null, getProcessStructureFromOriginal(result));
        }
    });
};

module.exports.findProcessStructures = (callback) => {
    processStructureSchema.find({}, (err, result) => {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};

module.exports.deleteOneProcessStructure = (criteria, callback) => {
    return processStructureSchema.deleteOne(criteria, callback);
};

module.exports.updateProcessStructure = (criteria, newProcessStructure, callback) => {
    return processStructureSchema.updateOne(criteria, newProcessStructure, callback);
};


/*********************/
/* Private Functions */
/*********************/

let getProcessStructureFromOriginal = function (processStructure) {
    return new ProcessStructure(processStructure.structureName,
        processStructure.initials,
        getProcessStructureStagesFromOriginal(processStructure.stages),
        processStructure.sankey, processStructure.available);
};

let getProcessStructureStagesFromOriginal = function (stages) {
    let newStages = [];
    stages.forEach((stage) => {
        newStages.push(new ProcessStructureStage(
            stage.roleID,
            stage.stageNum,
            stage.nextStages,
            stage.stagesToWaitFor,
            stage.onlineForms,
            stage.attachedFilesNames
        ));
    });
    return newStages;
};