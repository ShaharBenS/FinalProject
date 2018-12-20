let processStructure = require("../../schemas/ProcessStructure");
let helperFunctions = require('./helperFunctions');

module.exports.addProcessStructure = (structure_name, sankey_content, callback) => {
    helperFunctions.sankeyToStructure(sankey_content,(err,structure)=>{
        if(err){
            callback(err);
        }
        else{
            processStructure.create({
                structure_name: structure_name,
                initials: structure.initials,
                stages: structure.stages,
                sankey: sankey_content,
            }, callback)
        }
    });
};

module.exports.editProcessStructure = (structure_name, sankey_content, callback) => {
    helperFunctions.sankeyToStructure(sankey_content, (err,structure)=>{
        if(err){
            callback(err);
        }
        else{
            processStructure.findOneAndUpdate({structure_name: structure_name}, {
                $set: {
                    initials: structure.initials,
                    stages: structure.stages,
                    sankey: sankey_content,
                }
            }, callback);
        }
    });
};


module.exports.removeProcessStructure = (structure_name, callback) => {
    processStructure.findOneAndRemove({structure_name: structure_name}, callback)
};

module.exports.getProcessStructure = (name, callback) => {
    processStructure.find({structure_name: name}, (err, result) => {
        if (err) {
            callback(err);
        }
        else if (result.length === 0) {
            callback(new Error("No process structures named " + name + " found"))
        }
        else {
            callback(null,result[0])
        }
    })
};