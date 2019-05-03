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
};

let startProcess = function (done) {
    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
        if (err) done(err);
        else {
            done();
        }
    });
};

let startProcessAndHandleTwice = function (done) {
    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
        if (err) done(err);
        else {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, [], (err) => {
                if (err) done(err);
                else {
                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                        comments: 'הערות של מנהל נגטיב',
                        0: 'on',
                        1: 'on',
                        4: 'on',
                        processName: 'גרפיקה להקרנת בכורה'
                    }, [], (err) => {
                        if (err) done(err);
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

describe('1. Active Process Controller', function () {
    before(beforeGlobal);
    beforeEach(beforeEachTest);
    after(afterGlobal);
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
                                                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                                                        comments: 'הערות של מנהל נגטיב',
                                                        1: 'on',
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
                                                                    let availableProcess = availableProcesses3[0];
                                                                    assert(availableProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                    assert(availableProcess.processName, 'גרפיקה להקרנת בכורה 2');
                                                                    assert(availableProcess.processUrgency, 3);
                                                                    done();
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
        it('1.2.1 Waiting processes for people.', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה ליום הסטודנט 1', new Date(2018, 11, 24, 10, 33, 30, 0), 2, (err1, result) => {
                if (err1) {
                    done(err1);
                }
                else {
                    activeProcessController.getWaitingActiveProcessesByUser('graphicartist@outlook.co.il', (err2, waitingProcesses1) => {
                            if (err2) {
                                done(err2);
                            }
                            else {
                                assert.deepEqual(waitingProcesses1.length, 0);
                                activeProcessController.getWaitingActiveProcessesByUser('negativevicemanager@outlook.co.il', (err3, waitingProcesses2) => {
                                        if (err3) {
                                            done(err3);
                                        }
                                        else {
                                            assert.deepEqual(waitingProcesses2.length, 1);
                                            let waitingProcess = waitingProcesses2[0];
                                            assert(waitingProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                            assert(waitingProcess.processName, 'גרפיקה ליום הסטודנט 1');
                                            assert(waitingProcess.processUrgency, 2);
                                            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה ליום הסטודנט 2', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                                                if (err) done(err);
                                                else {
                                                    activeProcessController.getWaitingActiveProcessesByUser('negativevicemanager@outlook.co.il', (err4, waitingProcesses3) => {
                                                        if (err4) {
                                                            done(err4);
                                                        }
                                                        else {
                                                            assert.deepEqual(waitingProcesses3.length, 2);
                                                            let waitingProcess1 = waitingProcesses3[0];
                                                            assert(waitingProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                            assert(waitingProcess1.processName, 'גרפיקה ליום הסטודנט 1');
                                                            assert(waitingProcess1.processUrgency, 2);
                                                            let waitingProcess2 = waitingProcesses3[1];
                                                            assert(waitingProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                            assert(waitingProcess2.processName, 'גרפיקה ליום הסטודנט 2');
                                                            assert(waitingProcess2.processUrgency, 1);
                                                            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                                                comments: 'הערות של סגן מנהל נגטיב',
                                                                2: 'on',
                                                                processName: 'גרפיקה ליום הסטודנט 1'
                                                            }, [], (err5) => {
                                                                if (err5) {
                                                                    done(err5);
                                                                }
                                                                else {
                                                                    activeProcessController.getWaitingActiveProcessesByUser('negativemanager@outlook.co.il', (err6, waitingProcesses4) => {
                                                                        if (err6) {
                                                                            done(err6);
                                                                        }
                                                                        else {
                                                                            assert.deepEqual(waitingProcesses4.length, 1);
                                                                            let waitingProcess = waitingProcesses2[0];
                                                                            assert(waitingProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                            assert(waitingProcess.processName, 'גרפיקה ליום הסטודנט 2');
                                                                            assert(waitingProcess.processUrgency, 1);
                                                                            activeProcessController.getWaitingActiveProcessesByUser('negativevicemanager@outlook.co.il', (err7, waitingProcesses5) => {
                                                                                if (err7) {
                                                                                    done(err7);
                                                                                }
                                                                                else {
                                                                                    assert.deepEqual(waitingProcesses5.length, 1);
                                                                                    let waitingProcess = waitingProcesses2[0];
                                                                                    assert(waitingProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                    assert(waitingProcess.processName, 'גרפיקה ליום הסטודנט 2');
                                                                                    assert(waitingProcess.processUrgency, 1);
                                                                                }
                                                                            });
                                                                            activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                                                                                comments: 'הערות של מנהל נגטיב',
                                                                                1: 'on',
                                                                                processName: 'גרפיקה ליום הסטודנט 1'
                                                                            }, [], (err8) => {
                                                                                if (err8) {
                                                                                    done(err8);
                                                                                }
                                                                                else {
                                                                                    activeProcessController.getWaitingActiveProcessesByUser('negativemanager@outlook.co.il', (err9, waitingProcesses6) => {
                                                                                        if (err9) {
                                                                                            done(err9);
                                                                                        }
                                                                                        else {
                                                                                            assert.deepEqual(waitingProcesses6.length, 0);
                                                                                            done();
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
            });
        }).timeout(30000);
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