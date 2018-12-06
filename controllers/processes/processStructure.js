let ProcessStructure = require("../../schemas/ProcessStructure");

module.exports.addProcessStructure = (structure_name, initials, stages, callback)=>{
    ProcessStructure.create({
        structure_name:structure_name,
        initials:initials,
        stages:stages,
    },callback)
};