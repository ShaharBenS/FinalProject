let processStructureAccessor = require('../../models/accessors/processesAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let processStructureStage = require('../../domainObjects/processStructureStage');
let ProcessStructure = require('../../domainObjects/processStructure');

module.exports.addProcessStructure = (structureName, sankeyContent, callback) =>
{
    sankeyToStructure(sankeyContent, (err, structure) =>
    {
        if (err) {
            callback(err);
        }
        else {
            let newProcessStructure = new ProcessStructure(structureName, structure.initials, structure.stages, sankeyContent);
            if(newProcessStructure.checkDupStagesInStructure())
            {
                if(newProcessStructure.checkInitialsExistInProcessStages())
                {
                    processStructureAccessor.createProcessStructure(getProcessStructureForDB(newProcessStructure), callback);
                }
                else
                    callback(new Error('Some initial stages do not exist'));
            }
            else
                callback(new Error('There are two stages with the same number'));
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
            let newProcessStructure = new ProcessStructure(structureName, structure.initials, structure.stages, sankeyContent);
            if(newProcessStructure.checkDupStagesInStructure())
            {
                if(newProcessStructure.checkInitialsExistInProcessStages())
                {
                    processStructureAccessor.updateProcessStructure({structureName: structureName}, {
                        $set: {
                            initials: structure.initials,
                            stages: structure.stages,
                            sankey: sankeyContent,
                        }
                    }, callback);
                }
                else
                    callback(new Error('Some initial stages do not exist'));
            }
            else
                callback(new Error('There are two stages with the same number'));

        }
    });
};

module.exports.removeProcessStructure = (structureName, callback) =>
{
    processStructureAccessor.deleteOneProcessStructure({structureName: structureName}, callback)
};

module.exports.getProcessStructure = (name, callback) =>
{
    processStructureAccessor.findProcessStructure({structureName: name}, callback);
};

module.exports.getProcessStructureForDB = function (originProcessStructure)
{
    return {structureName: originProcessStructure.structureName,
        initials : originProcessStructure.initials,
        stages : getProcessStructureStagesForDB(originProcessStructure.stages),
        sankey : originProcessStructure.sankey};
};

module.exports.getProcessStructureStagesForDB = function (originStages)
{
    let returnStages = [];
    for(let i=0;i<originStages.length;i++)
    {
        returnStages.push({roleID : originStages[i].roleID,
        stageNum : originStages[i].stageNum,
        nextStages : originStages[i].nextStages,
        stagesToWaitFor : originStages[i].stagesToWaitFor,
        onlineForms : originStages[i].onlineForms,
        attachedFilesNames : originStages[i].attachedFilesNames});
    }
    return returnStages;
};

module.exports.getProcessStructureFromOriginal = (oldProcessStructure) =>
{
    return {structureName: oldProcessStructure.structureName,
        initials : oldProcessStructure.initials,
        stages : getProcessStagesFromOriginal(oldProcessStructure.stages),
        sankey : oldProcessStructure.sankey};
};

module.exports.getProcessStagesFromOriginal = (oldStages) =>
{
    let newStages = [];
    oldStages.forEach((stage) =>
    {
        newStages.push(new processStructureStage(
            stage.roleID,
            stage.stageNum,
            stage.nextStages,
            stage.stagesToWaitFor,
            stage.onlineForms,
            stage.attachedFilesNames
        ));
    });
    return newStages;
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
        return figure.bgColor === '#5957FF';

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