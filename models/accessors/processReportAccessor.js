let processReportSchema = require('../schemas/processesSchemas/ProcessReportSchema.js');
let ProcessReport = require('../../domainObjects/processReport');
let ProcessReportStage = require('../../domainObjects/processReportStage');

module.exports.createProcessReport = (PR, callback) => {
    return processReportSchema.create(PR, callback);
};

module.exports.findProcessReport = (PR, callback) => {
    return processReportSchema.findOne(PR, (err,res)=>{
        if(err) callback(err);
        else
        {
            callback(null,getProcessReportFromOriginal(res));
        }
    }).populate('stages.role stages.user stages.filledOnlineForms');
};

module.exports.deleteOneProcessReport = (PR, callback) => {
    return processReportSchema.deleteOne(PR, callback);
};

module.exports.updateProcessReport = (PR, update, callback) => {
    return processReportSchema.updateOne(PR, update, callback);
};

module.exports.findProcessesReports = (PR, callback) => {
    return processReportSchema.find(PR, (err, processReportsArray) => {
        if (err)
            callback(err);
        else {
            if (processReportsArray.length > 0) {
                callback(null, processReportsArray);
            } else
                callback(null, null);
        }
    });
};

/*********************/
/* Private Functions */
/*********************/

let getProcessReportFromOriginal = function (processReport) {
    return new ProcessReport(processReport,getProcessReportStagesFromOriginal(processReport.stages));
};


let getProcessReportStagesFromOriginal = function (stages) {
    let newStages = [];
    stages.forEach((stage) => {
        newStages.push(new ProcessReportStage(stage));
    });
    return newStages;
};