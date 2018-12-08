let processStructure = require("../../schemas/ProcessStructure");

module.exports.addProcessStructure = (structure_name, initials, stages, callback) => {
    processStructure.create({
        structure_name: structure_name,
        initials: initials,
        stages: stages,
    }, callback)
};

module.exports.editProcessStructure = (structure_name, initials, stages, callback) => {
    processStructure.findOneAndUpdate({structure_name: structure_name}, {
        $set: {
            initials: initials,
            stages: stages
        }
    }, callback)
};

module.exports.removeProcessStructure = (structure_name, callback) => {
    processStructure.findOneAndRemove({structure_name: structure_name}, callback)
};
