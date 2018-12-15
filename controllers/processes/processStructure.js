let processStructure = require("../../schemas/ProcessStructure");
let UsersAndRoles = require('../UsersAndRoles');
let mongoose = require('mongoose');

module.exports.addProcessStructure = (structure_name, sankey_content, callback) => {
    let parsed_sankey = JSON.parse(sankey_content);
    let initials = parsed_sankey.content.diagram.filter((figure) => {
        return figure.type === "sankey.shape.Start";

    }).map((figure, index) => {
        return index;
    });
    let stages = parsed_sankey.content.diagram.filter((figure) => {
        return figure.type !== "sankey.shape.Connection";

    });
    let connections = parsed_sankey.content.diagram.filter((figure)=>{
        return figure.type === "sankey.shape.Connection";
    });
    UsersAndRoles.getAllRoles((err, roles) => {
        if (err) {
            callback(err);
        }
        let rolesMap = {};
        roles.forEach(role => {
            rolesMap[role.roleName] = role._doc._id;
        });
        stages = stages.map((stage,index) => {
            let roleName = stage.labels[stage.type === 'sankey.shape.State' ? 0 : 1];
            let stageToReturn = {};
            stageToReturn.roleName =  mongoose.Types.ObjectId(rolesMap[roleName]);
            stageToReturn.stageNum = index;
            stageToReturn.nextStages = [];
            stageToReturn.stagesToWaitFor = [];

            connections.forEach(connection=>{
                // connection.source.node , connection.target.node
                // figure.id
                if(connection.source.node === stage.id){
                    let indexToPush = stages.indexOf(stages.find(_stage=>{
                        return _stage.id === connection.target.node;
                    }));
                    if(indexToPush > -1){
                        stageToReturn.nextStages.push(indexToPush);
                    }
                }
                if(connection.target.node === stage.id){
                    let indexToPush = stages.indexOf(stages.find(_stage=>{
                        return _stage.id === connection.source.node;
                    }));
                    if(indexToPush > -1) {
                        stageToReturn.stagesToWaitFor.push(indexToPush);
                    }
                }
            });

            stageToReturn.online_forms = [];
            stageToReturn.attached_files_names = [];
            return stageToReturn;
        });

        processStructure.create({
            structure_name: structure_name,
            initials: initials,
            stages: stages,
            sankey: sankey_content,
        }, callback)
    });


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