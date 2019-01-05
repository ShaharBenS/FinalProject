let processStructureAccessor = require('../../models/accessors/processesAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');

module.exports.addProcessStructure = (structureName, sankeyContent, callback) =>
{
    sankeyToStructure(sankeyContent, (err, structure) =>
    {
        if (err) {
            callback(err);
        }
        else {
            processStructureAccessor.createProcessStructure({
                structureName: structureName,
                initials: structure.initials,
                stages: structure.stages,
                sankey: sankeyContent,
            }, callback)
        }
    });
};

module.exports.editProcessStructure = (structureName, sankeyContent, callback) =>
{
    sankeyToStructure(sankeyContent, (err, structure) =>
    {
        if (err) {
            callback(err);
        }
        else {
            processStructureAccessor.updateProcessStructure({structureName: structureName}, {
                $set: {
                    initials: structure.initials,
                    stages: structure.stages,
                    sankey: sankeyContent,
                }
            }, callback);
        }
    });
};

module.exports.removeProcessStructure = (structureName, callback) =>
{
    processStructureAccessor.deleteOneProcessStructure({structureName: structureName}, callback)
};

module.exports.getProcessStructure = (name, callback) =>
{
    processStructureAccessor.findProcessStructure({structureName: name}, (err, result) =>
    {
        if (err) {
            callback(err);
        }
        else if (result.length === 0) {
            callback(new Error("No process structures named " + name + " found"))
        }
        else {
            callback(null, result[0])
        }
    });
};

module.exports.getProcessStagesFromOriginal = (oldStages, callback) =>
{
    let newStages = [];
    oldStages.forEach((stage) =>
    {
        newStages.push({
            roleID: stage.roleID,
            stageNum: stage.stageNum,
            nextStages: stage.nextStages,
            stagesToWaitFor: stage.stagesToWaitFor,
            onlineForms: stage.onlineForms,
            attachedFilesNames: stage.attachedFilesNames
        });
    });
    callback(newStages);
};

/*********************/
/* Private Functions */
/*********************/

let sankeyToStructure = function (sankeyContent, callback)
{
    let parsedSankey = JSON.parse(sankeyContent);
    let stages = parsedSankey.content.diagram.filter((figure) =>
    {
        return figure.type !== "sankey.shape.Connection";
    });
    let connections = parsedSankey.content.diagram.filter((figure) =>
    {
        return figure.type === "sankey.shape.Connection";
    });
    let initials = stages.filter((figure) =>
    {
        let isStart = true;
        connections.forEach(connection =>
        {
            if (connection.target.node === figure.id) {
                isStart = false;
            }
        });
        return isStart;
    }).map((figure) =>
    {
        let index;
        stages.forEach((stage, _index) =>
        {
            if (stage.id === figure.id) {
                index = _index;
            }
        });
        return index;
    });
    usersAndRolesController.getAllRoles((err, roles) =>
    {
        if (err) {
            callback(err);
        }
        let rolesMap = {};
        roles.forEach(role =>
        {
            rolesMap[role.roleName] = role._id;
        });
        stages = stages.map((stage, index) =>
        {
            let roleName = stage.labels[0].text;
            let stageToReturn = {};
            stageToReturn.roleName = rolesMap[roleName];
            stageToReturn.stageNum = index;
            stageToReturn.nextStages = [];
            stageToReturn.stagesToWaitFor = [];

            connections.forEach(connection =>
            {
                // connection.source.node , connection.target.node
                // figure.id
                if (connection.source.node === stage.id) {
                    let indexToPush = stages.indexOf(stages.find(_stage =>
                    {
                        return _stage.id === connection.target.node;
                    }));
                    if (indexToPush > -1) {
                        stageToReturn.nextStages.push(indexToPush);
                    }
                }
                if (connection.target.node === stage.id) {
                    let indexToPush = stages.indexOf(stages.find(_stage =>
                    {
                        return _stage.id === connection.source.node;
                    }));
                    if (indexToPush > -1) {
                        stageToReturn.stagesToWaitFor.push(indexToPush);
                    }
                }
            });

            stageToReturn.onlineForms = [];
            stageToReturn.attachedFilesNames = [];
            return stageToReturn;
        });
        callback(null,
            {
                initials: initials,
                stages: stages,
            });
    });
};