let processReportSchema = require('../schemas/processesSchemas/ProcessReportSchema.js');

module.exports.createProcessReport = (PR, callback) => {
    return processReportSchema.create(PR, callback);
};

module.exports.findProcessReport = (PR, callback) => {
    return processReportSchema.findOne(PR, callback);
};

module.exports.deleteOneProcessReport = (PR, callback) => {
    return processReportSchema.deleteOne(PR, callback);
};

module.exports.updateProcessReport = (PR, update, callback) => {
    return processReportSchema.updateOne(PR, update, callback);
};

module.exports.findProcessesReports = (AP, callback) => {
    return processReportSchema.find(AP, (err, processReportsArray) => {
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