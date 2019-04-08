let waitingProcessStructuresSchema = require('../schemas/processesSchemas/WaitingProcessStructuresSchema');

module.exports.addWaitingProcessStructure = (waitingStructure, callback) =>
{
    waitingProcessStructuresSchema.create(waitingStructure, callback);
};

module.exports.findWaitingProcessStructures = (criteria, callback) =>
{
    waitingProcessStructuresSchema.find(criteria, callback);
};

module.exports.removeWaitingProcessStructures = (critria, callback)=>{
    waitingProcessStructuresSchema.deleteMany(critria,callback);
};

module.exports.updateWaitingProcessStructures = (critria,update,callback)=>{
    waitingProcessStructuresSchema.updateMany(critria,update,callback);
};