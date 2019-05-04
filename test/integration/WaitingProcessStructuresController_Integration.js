let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let ObjectId = require('mongodb').ObjectID;
let UsersAndRolesTreeSankey = require('../../controllers/usersControllers/usersAndRolesController');
let sankeyContent = require('../inputs/trees/treesForActiveProcessTest/usersTree1sankey');
let emailsToFullName = require('../inputs/trees/treesForActiveProcessTest/usersTree1EmailsToFullNames');
let rolesToDereg = require('../inputs/trees/treesForActiveProcessTest/usersTree1RolesToDeregs');
let rolesToEmails = require('../inputs/trees/treesForActiveProcessTest/usersTree1RolesToEmails');
let modelUsersAndRoles = require('../../models/schemas/usersSchemas/UsersAndRolesSchema');
let usersAndRolesTreeSankey = require('../../models/schemas/usersSchemas/UsersAndRolesTreeSankeySchema');
let userAccessor = require('../../models/accessors/usersAccessor');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let processStructureSankeyJSON = require('../inputs/processStructures/processStructuresForActiveProcessTest/processStructure1');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let usersAndRolesContoller = require('../../controllers/usersControllers/usersAndRolesController');
let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let filledOnlineFormsController = require('../../controllers/onlineFormsControllers/filledOnlineFormController');
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');
let usersPermissionsController = require('../../controllers/usersControllers/UsersPermissionsController');
let UserPermissions = require('../../domainObjects/UserPermissions');
let waitingProcessStructureController = require('../../controllers/processesControllers/waitingProcessStructuresController');
let waitingProcessStructureAccessor = require('../../models/accessors/waitingProcessStructuresAccessor');


let beforeGlobal = async function () {
    this.enableTimeouts(false);
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
};

let beforeEachTest = function (done) {
    this.enableTimeouts(false);
    mongoose.connection.db.dropDatabase();
    userAccessor.createSankeyTree({sankey: JSON.stringify({content: {diagram: []}})}, (err, result) => {
        if (err) {
            done(err);
        }
        else {
            UsersAndRolesTreeSankey.setUsersAndRolesTree('chairman@outlook.co.il', JSON.stringify(sankeyContent),
                rolesToEmails, emailsToFullName,
                rolesToDereg, (err) => {
                    if (err) {
                        done(err);
                    }
                    else {
                        processStructureController.addProcessStructure('graphicartist@outlook.co.il', 'תהליך גרפיקה', JSON.stringify(processStructureSankeyJSON), [], 0, "12", (err, needApproval) => {
                            if (err) {
                                done(err);
                            }
                            else {
                                done();
                            }
                        });
                    }
                });
        }
    });
};

let afterGlobal = function () {
    mongoose.connection.close();
};

describe('1. Waiting Process Structure Controller', function () {
    before(beforeGlobal);
    beforeEach(beforeEachTest);
    after(afterGlobal);
    describe('1.1 approveProcessStructure', function () {
        it('1.1.1 approveProcessStructure correct', function (done) {
            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                if (err) done(err);
                else {
                    assert.deepEqual(structure.length, 1);
                    waitingProcessStructureController.approveProcessStructure('chairman@outlook.co.il', structure[0]._id, (err) => {
                        if (err) done(err);
                        else {
                            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                                if (err) done(err);
                                else {
                                    assert.deepEqual(structure.length, 0);
                                    done();
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.1.2 approveProcessStructure user is not authorized', function (done) {
            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                if (err) done(err);
                else {
                    assert.deepEqual(structure.length, 1);
                    waitingProcessStructureController.approveProcessStructure('graphicartist@outlook.co.il', structure[0]._id, (err) => {
                        assert.deepEqual(true, err !== null);
                        assert.deepEqual(err.message, 'ERROR: You don\'t have the required permissions to perform this operation');
                        waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(structure.length, 1);
                                done();
                            }
                        });
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.2 disapproveProcessStructure', function () {
        it('1.2.1 approveProcessStructure correct', function (done) {
            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                if (err) done(err);
                else {
                    assert.deepEqual(structure.length, 1);
                    waitingProcessStructureController.disapproveProcessStructure('chairman@outlook.co.il', structure[0]._id, (err) => {
                        if (err) done(err);
                        else {
                            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                                if (err) done(err);
                                else {
                                    assert.deepEqual(structure.length, 0);
                                    done();
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.2.2 disapproveProcessStructure user is not authorized', function (done) {
            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                if (err) done(err);
                else {
                    assert.deepEqual(structure.length, 1);
                    waitingProcessStructureController.disapproveProcessStructure('graphicartist@outlook.co.il', structure[0]._id, (err) => {
                        assert.deepEqual(true, err !== null);
                        assert.deepEqual(err.message, 'ERROR: You don\'t have the required permissions to perform this operation');
                        waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(structure.length, 1);
                                done();
                            }
                        });
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.3 updateStructure', function () {
        it('1.3.1 updateStructure correct', function (done) {
            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                if (err) done(err);
                else {
                    assert.deepEqual(structure.length, 1);
                    waitingProcessStructureController.updateStructure('chairman@outlook.co.il', structure[0]._id, 'sankey', [], "24", "24", (err) => {
                        if (err) done(err);
                        else {
                            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                                if (err) done(err);
                                else {
                                    assert.deepEqual(structure.length, 1);
                                    assert.deepEqual(structure[0].sankey, 'sankey');
                                    assert.deepEqual(structure[0].onlineForms, []);
                                    assert.deepEqual(structure[0].automaticAdvanceTime, 24);
                                    assert.deepEqual(structure[0].notificationTime, 24);
                                    done();
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.3.2 updateStructure user is not authorized', function (done) {
            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                if (err) done(err);
                else {
                    assert.deepEqual(structure.length, 1);
                    waitingProcessStructureController.updateStructure('graphicartist@outlook.co.il', structure[0]._id, 'sankey', [], "24", "24", (err, result) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(result, 'אין לך הרשאות');
                            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                                assert.deepEqual(structure.length, 1);
                                /*assert.deepEqual(structure[0].sankey, 'sankey');
                                    assert.deepEqual(structure[0].onlineForms, []);
                                    assert.deepEqual(structure[0].automaticAdvanceTime, 24);
                                    assert.deepEqual(structure[0].notificationTime, 24);
                                    */
                                done();
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.4 getWaitingStructureById', function () {
        it('1.4.1 getWaitingStructureById found', function (done) {
            waitingProcessStructureAccessor.findWaitingProcessStructures({structureName: 'תהליך גרפיקה'}, (err, structure) => {
                if (err) done(err);
                else {
                    assert.deepEqual(structure.length, 1);
                    waitingProcessStructureController.getWaitingStructureById(structure[0]._id, (err, structure) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(structure.sankey, JSON.stringify(processStructureSankeyJSON));
                            assert.deepEqual(structure.onlineForms, []);
                            assert.deepEqual(structure.automaticAdvanceTime, 0);
                            assert.deepEqual(structure.notificationTime, 12);
                            done();
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.4.2 getWaitingStructureById not found', function (done) {
            waitingProcessStructureController.getWaitingStructureById(ObjectId(), (err, structure) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err, 'Error: no such structure found');
                done();
            });
        }).timeout(30000);
    });
});