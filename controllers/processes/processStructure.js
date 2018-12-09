let processStructure = require("../../schemas/ProcessStructure");

module.exports.addProcessStructure = (structure_name,sankey_content, callback) => {
    let parsed_sankey = JSON.parse(sankey_content);
    let initials = parsed_sankey.content.diagram.filter((figure)=>{
        return figure.type === "sankey.shape.Start";

    }).map((figure,index)=>{
        return index;
    });
    let stages = parsed_sankey.content.diagram.filter((figure)=>{
        return figure.type !== "sankey.shape.Connection";

    });

    //TODO: stages from sankey

    processStructure.create({
        structure_name: structure_name,
        initials: initials,
        stages: stages,
        sankey: sankey_content,
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