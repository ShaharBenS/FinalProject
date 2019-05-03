let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
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


let globalBefore = function (done) {
    this.enableTimeouts(false);
    mongoose.set('useCreateIndex', true);
    mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true}).then(() => {
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
                            processStructureController.addProcessStructure('chairman@outlook.co.il', 'תהליך גרפיקה', JSON.stringify(processStructureSankeyJSON), [], 0, "12", (err, needApproval) => {
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
    });

};

let globalAfter = function () {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
};

describe('1. Active Process Controller', function () {
    before(globalBefore);
    after(globalAfter);
    describe('1.1 getAvailableActiveProcessesByUser', function () {
        it('1.1.1 The process is not available for anyone.', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה 1', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err1, result) => {
                if (err1) {
                    done(err1);
                }
                else {
                    activeProcessController.getAvailableActiveProcessesByUser('negativevicemanager@outlook.co.il', (err2, availableProcesses) => {
                        if (err2) {
                            done(err2);
                        }
                        else {
                            assert.deepEqual(availableProcesses.length, 0);
                            done();
                        }
                    });
                }
            });
        }).timeout(30000);
        it('1.1.2 The process is available for several people.', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה 2', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err1, result) => {
                    if (err1) {
                        done(err1);
                    }
                    else {
                        activeProcessController.getAvailableActiveProcessesByUser('graphicartist@outlook.co.il', (err2, availableProcesses1) => {
                                if (err2) {
                                    done(err2);
                                }
                                else {
                                    assert.deepEqual(availableProcesses1.length, 0);
                                    activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                        comments: 'הערות של סגן מנהל נגטיב',
                                        2: 'on',
                                        processName: 'גרפיקה להקרנת בכורה 2'
                                    }, [], (err3) => {
                                        if (err3) {
                                            done(err3);
                                        }
                                        else {
                                            activeProcessController.getAvailableActiveProcessesByUser('negativemanager@outlook.co.il', (err4, availableProcesses2) => {
                                                if (err2) {
                                                    done(err2);
                                                }
                                                else {
                                                    assert.deepEqual(availableProcesses2.length, 0);
                                                    activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                                        comments: 'הערות של מנהל נגטיב',
                                                        4: 'on',
                                                        processName: 'גרפיקה להקרנת בכורה 2'
                                                    }, [], (err5) => {
                                                        if (err5) {
                                                            done(err5);
                                                        }
                                                        else {
                                                            activeProcessController.getAvailableActiveProcessesByUser('graphicartist@outlook.co.il', (err6, availableProcesses3) => {
                                                                if (err6) {
                                                                    done(err6);
                                                                }
                                                                else {
                                                                    assert.deepEqual(availableProcesses3.length, 1);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        )
                    }
                }
            )
        }).timeout(30000);
    });
        describe('1.2 getWaitingActiveProcessesByUser', function () {
        });
        describe('1.3 getAllActiveProcesses', function () {
        });
        describe('1.4 getAllActiveProcessesByUser', function () {
        });
        describe('1.5 getActiveProcessByProcessName', function () {
        });
        describe('1.6 replaceRoleIDWithRoleNameAndUserEmailWithUserName', function () {
        });
        describe('1.7 convertDate', function () {
        });
    });