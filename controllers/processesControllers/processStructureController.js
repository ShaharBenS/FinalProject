let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let ProcessStructure = require('../../domainObjects/processStructure');
let processStructureSankey = require('../../domainObjects/processStructureSankey');

module.exports.addProcessStructure = (structureName, sankeyContent, callback) => {
    sankeyToStructure(sankeyContent, (err, structure) => {
        if (err) {
            callback(err);
        } else {
            let newProcessStructure = new ProcessStructure(structureName, structure.initials, structure.stages, sankeyContent);
            if (newProcessStructure.checkNotDupStagesInStructure()) {
                if (newProcessStructure.checkInitialsExistInProcessStages()) {
                    if (newProcessStructure.checkPrevNextSymmetric()) {
                        if (newProcessStructure.checkNextPrevSymmetric()) {
                            processStructureAccessor.createProcessStructure(this.getProcessStructureForDB(newProcessStructure), callback);
                        } else
                            callback(new Error('Some stages have next stages that dont contain them for previous'));
                    } else
                        callback(new Error('Some stages have previous stages that dont contain them for next'));
                } else
                    callback(new Error('Some initial stages do not exist'));
            } else
                callback(new Error('There are two stages with the same number'));
        }
    });
};

module.exports.editProcessStructure = (structureName, sankeyContent, callback) => {
    sankeyToStructure(sankeyContent, (err, structure) => {
        if (err) {
            callback(err);
        } else {
            let newProcessStructure = new ProcessStructure(structureName, structure.initials, structure.stages, sankeyContent);
            if (newProcessStructure.checkNotDupStagesInStructure()) {
                if (newProcessStructure.checkInitialsExistInProcessStages()) {
                    if (newProcessStructure.checkPrevNextSymmetric()) {
                        if (newProcessStructure.checkNextPrevSymmetric()) {
                            processStructureAccessor.updateProcessStructure({structureName: structureName}, {
                                $set: {
                                    initials: structure.initials,
                                    stages: structure.stages,
                                    sankey: sankeyContent,
                                }
                            }, callback);
                        } else
                            callback(new Error('Some stages have next stages that dont contain them for previous'));
                    } else
                        callback(new Error('Some stages have previous stages that dont contain them for next'));
                } else
                    callback(new Error('Some initial stages do not exist'));
            } else
                callback(new Error('There are two stages with the same number'));
        }
    });
};

module.exports.removeProcessStructure = (structureName, callback) => {
    processStructureAccessor.deleteOneProcessStructure({structureName: structureName}, callback)
};

module.exports.getProcessStructure = (name, callback) => {
    processStructureAccessor.findProcessStructure({structureName: name}, callback);
};

module.exports.getAllProcessStructures = (callback) => {
    processStructureAccessor.findProcessStructures(callback)
};

module.exports.getProcessStructureForDB = function (originProcessStructure) {
    return {
        structureName: originProcessStructure.structureName,
        initials: originProcessStructure.initials,
        stages: this.getProcessStructureStagesForDB(originProcessStructure.stages),
        sankey: originProcessStructure.sankey
    };
};

module.exports.getProcessStructureStagesForDB = function (originStages) {
    let returnStages = [];
    for (let i = 0; i < originStages.length; i++) {
        returnStages.push({
            roleID: originStages[i].roleID,
            stageNum: originStages[i].stageNum,
            nextStages: originStages[i].nextStages,
            stagesToWaitFor: originStages[i].stagesToWaitFor,
            onlineForms: originStages[i].onlineForms,
            attachedFilesNames: originStages[i].attachedFilesNames
        });
    }
    return returnStages;
};


/*********************/
/* Private Functions */
/*********************/

let sankeyToStructure = function (sankeyContent, callback) {
    let processStructureSankeyObject = new processStructureSankey(JSON.parse(sankeyContent));
    let initials = processStructureSankeyObject.getInitials();

    usersAndRolesController.getAllRoles((err, roles) => {
        if (err) {
            callback(err);
        }
        let rolesMap = {};
        roles.forEach(role => {
            rolesMap[role.roleName] = role._id;
        });
        let stages = processStructureSankeyObject.getStages((roleName) => {
            return rolesMap[roleName]
        });
        callback(null,
            {
                initials: initials,
                stages: stages,
            });
    });
};