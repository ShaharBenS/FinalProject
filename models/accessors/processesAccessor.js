let processStructureController = require('../../controllers/processesControllers/processStructureController');
let activeProcess = require('../../domainObjects/activeProcess');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let activeProcessStage = require('../../domainObjects/activeProcessStage');
let processStructureSchema = require('../schemas/processesSchemas/ProcessStructureSchema.js');
let activeProcessSchema = require('../schemas/processesSchemas/ProcessStructureSchema.js');
let processReportSchema = require('../schemas/processesSchemas/ProcessReportSchema.js');

/* processStructure */

module.exports.createProcessStructure = (newProcessStructure, callback) =>
{
    processStructureSchema.create(newProcessStructure, callback);
};

module.exports.findProcessStructure = (criteria, callback) =>
{
    processStructureSchema.findOne(criteria, (err,result)=>{
        if(err)
        {
            callback(err);
        }
        else
        {
            if(result)
            {
                callback(null,processStructureController.getProcessStructureFromOriginal(result));
            }
            else
            {
                callback(new Error('There were no processes found.'));
            }
        }
    });
};

module.exports.deleteOneProcessStructure = (criteria, callback) =>
{
    return processStructureSchema.deleteOne(criteria, callback);
};

module.exports.updateProcessStructure = (criteria, newProcessStructure, callback) =>
{
    return processStructureSchema.updateOne(criteria, newProcessStructure, callback);
};

/* activeProcess */

module.exports.getActiveProcessByProcessName = (processName, callback) =>
{
    activeProcessSchema.findOne({processName: processName}, (err, process) =>
    {
        if (err)
            callback(err);
        else {
            if (process)
                callback(null,activeProcessController.getActiveProcessFromOriginal(process));
            else
                callback(null, null);
            }
    });
};

module.exports.createActiveProcess = (AP, callback) =>
{
    return activeProcessSchema.create(AP, callback);
};

module.exports.findActiveProcesses = (AP, callback) =>
{
    return activeProcessSchema.find(AP, (err,activeProcessArray)=>{
        if(err)
            callback(err);
        else
        {
            if(activeProcessArray.length > 0)
            {
                let newActiveProcessArray = [];
                activeProcessArray.forEach((process)=>
                {
                    newActiveProcessArray.push(processStructureController.getProcessStructureFromOriginal(process));
                });
                callback(null,newActiveProcessArray);
            }
            else
                callback(null,null);
        }
    });
};

module.exports.deleteOneActiveProcess = (AP, callback) =>
{
    return activeProcessSchema.deleteOne(AP, callback);
};

module.exports.updateActiveProcess = (AP, update, callback) =>
{
    return activeProcessSchema.updateOne(AP, update, callback);
};

/* processReport */
module.exports.createProcessReport = (PR, callback) =>
{
    return processReportSchema.create(PR, callback);
};

module.exports.findProcessReport = (PR, callback) =>
{
    return processReportSchema.find(PR, callback);
};

module.exports.deleteOneProcessReport = (PR, callback) =>
{
    return processReportSchema.deleteOne(PR, callback);
};

module.exports.updateProcessReport = (PR, update, callback) =>
{
    return processReportSchema.updateOne(PR, update, callback);
};