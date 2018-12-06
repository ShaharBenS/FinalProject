let ProcessStructure = require("../../schemas/ProcessStructure");

module.exports.addProcessStructure = (structure_name, initials, stages, callback)=>{
    ProcessStructure.create({
        structure_name:structure_name,
        initials:initials,
        stages:stages,
    },callback)
};

module.exports.editProcessStructure = (structure_name, initials, stages, callback)=>{
    ProcessStructure.findOneAndUpdate({structure_name : structure_name}, { $set: { initials: initials, stages:stages}},callback)
};

module.exports.removeProcessStructure = (structure_name, callback)=>{
    ProcessStructure.findOneAndRemove({structure_name : structure_name},callback)
};
