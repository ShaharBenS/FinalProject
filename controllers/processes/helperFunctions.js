let ActiveProcess = require("../../schemas/ActiveProcess");
let UsersAndRoles = require("../../schemas/UsersAndRoles");
let ProcessStructure = require("../../schemas/ProcessStructure");
let UserAndRolesControllers = require("../UsersAndRoles");
let mongoose = require('mongoose');


exports.getRoleName_by_username = function (username) {
    UsersAndRoles.find({userEmail: username}, (err, user) => {
        if (err) throw err;
        else {
            if (user.length === 0) throw ">>> ERROR: user " + username + " has no role";
            return user[0].roleName;
        }
    });
};

exports.getProcessStructure = function (processStructureName) {
    ProcessStructure.find({structure_name: processStructureName}, (err, processStructure) => {
        if (err) throw err;
        else {
            if (processStructure.length === 0) throw ">>> ERROR: processStructure " + processStructure + " does not exists";
            return processStructure[0];
        }
    });
};

exports.getActiveProcessByProcessName = function (processName) {
    ActiveProcess.find({process_name: processName}, (err, process) => {
        if (err) throw err;
        else {
            if (process.length === 0) return false;
            return process[0];
        }
    });
};

exports.sankeyToStructure = function (sankey_content, callback) {
    let parsed_sankey = JSON.parse(sankey_content);
    let stages = parsed_sankey.content.diagram.filter((figure) => {
        return figure.type !== "sankey.shape.Connection";
    });
    let connections = parsed_sankey.content.diagram.filter((figure) => {
        return figure.type === "sankey.shape.Connection";
    });
    let initials = stages.filter((figure) => {
        let isStart = true;
        connections.forEach(connection=>{
            if(connection.target.node === figure.id){
                isStart = false;
            }
        });
        return isStart;
    }).map((figure) => {
        let index;
        stages.forEach((stage,_index)=>{
           if(stage.id === figure.id){
               index = _index;
           }
        });
        return index;
    });
    UserAndRolesControllers.getAllRoles((err, roles) => {
        if (err) {
            callback(err);
        }
        let rolesMap = {};
        roles.forEach(role => {
            rolesMap[role.roleName] = role._id;
        });
        stages = stages.map((stage, index) => {
            let roleName = stage.labels[0].text;
            let stageToReturn = {};
            stageToReturn.roleName = rolesMap[roleName];
            stageToReturn.stageNum = index;
            stageToReturn.nextStages = [];
            stageToReturn.stagesToWaitFor = [];

            connections.forEach(connection => {
                // connection.source.node , connection.target.node
                // figure.id
                if (connection.source.node === stage.id) {
                    let indexToPush = stages.indexOf(stages.find(_stage => {
                        return _stage.id === connection.target.node;
                    }));
                    if (indexToPush > -1) {
                        stageToReturn.nextStages.push(indexToPush);
                    }
                }
                if (connection.target.node === stage.id) {
                    let indexToPush = stages.indexOf(stages.find(_stage => {
                        return _stage.id === connection.source.node;
                    }));
                    if (indexToPush > -1) {
                        stageToReturn.stagesToWaitFor.push(indexToPush);
                    }
                }
            });

            stageToReturn.online_forms = [];
            stageToReturn.attached_files_names = [];
            return stageToReturn;
        });
        callback(null,
            {
                initials: initials,
                stages: stages,
            });
    });
};