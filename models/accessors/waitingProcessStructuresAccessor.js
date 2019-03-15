let waitingProcessStructuresSchema = require('../schemas/processesSchemas/WaitingProcessStructures');

module.exports.addWaitingProcessStructure = (waitingStructure, callback) =>
{
    waitingProcessStructuresSchema.create(waitingStructure, callback);
};

module.exports.findProcessStructures = (criteria, callback) =>
{
    waitingProcessStructuresSchema.find(criteria, callback);
};