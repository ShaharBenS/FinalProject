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
let activeProcess = require('../../domainObjects/activeProcess');
let activeProcessStage = require('../../domainObjects/activeProcessStage');

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
                                                                    assert.deepEqual(availableProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                    assert.deepEqual(availableProcess.processName, 'גרפיקה להקרנת בכורה 2');
                                                                    assert.deepEqual(availableProcess.processUrgency, 3);
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
                                            assert.deepEqual(waitingProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(waitingProcess.processName, 'גרפיקה ליום הסטודנט 1');
                                            assert.deepEqual(waitingProcess.processUrgency, 2);
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
                                                            assert.deepEqual(waitingProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                            assert.deepEqual(waitingProcess1.processName, 'גרפיקה ליום הסטודנט 1');
                                                            assert.deepEqual(waitingProcess1.processUrgency, 2);
                                                            let waitingProcess2 = waitingProcesses3[1];
                                                            assert.deepEqual(waitingProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                            assert.deepEqual(waitingProcess2.processName, 'גרפיקה ליום הסטודנט 2');
                                                            assert.deepEqual(waitingProcess2.processUrgency, 3);
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
                                                                            assert.deepEqual(waitingProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                            assert.deepEqual(waitingProcess.processName, 'גרפיקה ליום הסטודנט 1');
                                                                            assert.deepEqual(waitingProcess.processUrgency, 2);
                                                                            activeProcessController.getWaitingActiveProcessesByUser('negativevicemanager@outlook.co.il', (err7, waitingProcesses5) => {
                                                                                if (err7) {
                                                                                    done(err7);
                                                                                }
                                                                                else {
                                                                                    assert.deepEqual(waitingProcesses5.length, 1);
                                                                                    let waitingProcess = waitingProcesses2[0];
                                                                                    assert.deepEqual(waitingProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                    assert.deepEqual(waitingProcess.processName, 'גרפיקה ליום הסטודנט 1');
                                                                                    assert.deepEqual(waitingProcess.processUrgency, 2);
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
        it('1.3.1 Active processes of everyone.', function (done) {
            activeProcessController.getAllActiveProcesses((err, activeProcesses1) => {
                if (err) {
                    done(err);
                }
                else {
                    assert.deepEqual(activeProcesses1.length, 0);
                    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה ליום פרוייקטים 1', new Date(2018, 11, 24, 10, 33, 30, 0), 1, (err1, result1) => {
                        if (err1) {
                            done(err1);
                        }
                        else {
                            activeProcessController.getAllActiveProcesses((err2, activeProcesses2) => {
                                    if (err2) {
                                        done(err2);
                                    }
                                    else {
                                        assert.deepEqual(activeProcesses2.length, 1);
                                        let activeProcess1 = activeProcesses2[0];
                                        assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                        assert.deepEqual(activeProcess1.processName, 'גרפיקה ליום פרוייקטים 1');
                                        assert.deepEqual(activeProcess1.processUrgency, 1);
                                        assert.deepEqual(activeProcess1.currentStages, [3]);
                                        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה ליום פרוייקטים 2', new Date(2018, 11, 24, 10, 33, 30, 0), 2, (err3, result3) => {
                                            if (err3) done(err3);
                                            else {
                                                activeProcessController.getAllActiveProcesses((err4, activeProcesses3) => {
                                                    if (err4) {
                                                        done(err4);
                                                    }
                                                    else {
                                                        assert.deepEqual(activeProcesses3.length, 2);
                                                        let activeProcess1 = activeProcesses3[0];
                                                        assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                        assert.deepEqual(activeProcess1.processName, 'גרפיקה ליום פרוייקטים 1');
                                                        assert.deepEqual(activeProcess1.processUrgency, 1);
                                                        assert.deepEqual(activeProcess1.currentStages, [3]);
                                                        let activeProcess2 = activeProcesses3[1];
                                                        assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                        assert.deepEqual(activeProcess2.processName, 'גרפיקה ליום פרוייקטים 2');
                                                        assert.deepEqual(activeProcess2.processUrgency, 2);
                                                        assert.deepEqual(activeProcess2.currentStages, [3]);
                                                        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                                            comments: 'הערות של סגן מנהל נגטיב',
                                                            2: 'on',
                                                            processName: 'גרפיקה ליום פרוייקטים 1'
                                                        }, [], (err5) => {
                                                            if (err5) {
                                                                done(err5);
                                                            }
                                                            else {
                                                                activeProcessController.getAllActiveProcesses((err6, activeProcesses4) => {
                                                                    if (err6) {
                                                                        done(err6);
                                                                    }
                                                                    else {
                                                                        assert.deepEqual(activeProcesses4.length, 2);
                                                                        let activeProcess1 = activeProcesses4[0];
                                                                        assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                        assert.deepEqual(activeProcess1.processName, 'גרפיקה ליום פרוייקטים 1');
                                                                        assert.deepEqual(activeProcess1.processUrgency, 1);
                                                                        assert.deepEqual(activeProcess1.currentStages, [2]);
                                                                        let activeProcess2 = activeProcesses4[1];
                                                                        assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                        assert.deepEqual(activeProcess2.processName, 'גרפיקה ליום פרוייקטים 2');
                                                                        assert.deepEqual(activeProcess2.processUrgency, 2);
                                                                        assert.deepEqual(activeProcess2.currentStages, [3]);
                                                                        activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                                                                            comments: 'הערות של מנהל נגטיב',
                                                                            4: 'on',
                                                                            processName: 'גרפיקה ליום פרוייקטים 1'
                                                                        }, [], (err7) => {
                                                                            if (err7) {
                                                                                done(err7);
                                                                            }
                                                                            else {
                                                                                activeProcessController.getAllActiveProcesses((err8, activeProcesses5) => {
                                                                                    if (err8) {
                                                                                        done(err8);
                                                                                    }
                                                                                    else {
                                                                                        assert.deepEqual(activeProcesses5.length, 2);
                                                                                        let activeProcess1 = activeProcesses5[0];
                                                                                        assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                        assert.deepEqual(activeProcess1.processName, 'גרפיקה ליום פרוייקטים 1');
                                                                                        assert.deepEqual(activeProcess1.processUrgency, 1);
                                                                                        assert.deepEqual(activeProcess1.currentStages, [4]);
                                                                                        let activeProcess2 = activeProcesses5[1];
                                                                                        assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                        assert.deepEqual(activeProcess2.processName, 'גרפיקה ליום פרוייקטים 2');
                                                                                        assert.deepEqual(activeProcess2.processUrgency, 2);
                                                                                        assert.deepEqual(activeProcess2.currentStages, [3]);
                                                                                        activeProcessController.uploadFilesAndHandleProcess('publicitydepartmenthead@outlook.co.il', {
                                                                                            comments: 'הערות של רמד הסברה',
                                                                                            processName: 'גרפיקה ליום פרוייקטים 1'
                                                                                        }, [], (err9) => {
                                                                                            if (err9) {
                                                                                                done(err9);
                                                                                            }
                                                                                            else {
                                                                                                activeProcessController.getAllActiveProcesses((err10, activeProcesses6) => {
                                                                                                    if (err10) {
                                                                                                        done(err10);
                                                                                                    }
                                                                                                    else {
                                                                                                        assert.deepEqual(activeProcesses6.length, 1);
                                                                                                        let activeProcess1 = activeProcesses6[0];
                                                                                                        assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                                        assert.deepEqual(activeProcess1.processName, 'גרפיקה ליום פרוייקטים 2');
                                                                                                        assert.deepEqual(activeProcess1.processUrgency, 2);
                                                                                                        assert.deepEqual(activeProcess1.currentStages, [3]);
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
                    });
                }
            });
        }).timeout(30000);
    });
    describe('1.4 getAllActiveProcessesByUser', function () {
        it('1.4.1 Active processes of specific users.', function (done) {
            activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err, activeProcesses1) => {
                if (err) {
                    done(err);
                }
                else {
                    assert.deepEqual(activeProcesses1.length, 0);
                    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לכבוד סיום התואר 1', new Date(2018, 11, 24, 10, 33, 30, 0), 1, (err1, result1) => {
                        if (err1) {
                            done(err1);
                        }
                        else {
                            activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err2, activeProcesses2) => {
                                    if (err2) {
                                        done(err2);
                                    }
                                    else {
                                        assert.deepEqual(activeProcesses2.length, 1);
                                        let activeProcess1 = activeProcesses2[0];
                                        assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                        assert.deepEqual(activeProcess1.processName, 'גרפיקה לכבוד סיום התואר 1');
                                        assert.deepEqual(activeProcess1.processUrgency, 1);
                                        assert.deepEqual(activeProcess1.currentStages, [3]);
                                        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לכבוד סיום התואר 2', new Date(2018, 11, 24, 10, 33, 30, 0), 2, (err3, result3) => {
                                            if (err3) done(err3);
                                            else {
                                                activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err4, activeProcesses3) => {
                                                    if (err4) {
                                                        done(err4);
                                                    }
                                                    else {
                                                        assert.deepEqual(activeProcesses3.length, 2);
                                                        let activeProcess1 = activeProcesses3[0];
                                                        assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                        assert.deepEqual(activeProcess1.processName, 'גרפיקה לכבוד סיום התואר 1');
                                                        assert.deepEqual(activeProcess1.processUrgency, 1);
                                                        assert.deepEqual(activeProcess1.currentStages, [3]);
                                                        let activeProcess2 = activeProcesses3[1];
                                                        assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                        assert.deepEqual(activeProcess2.processName, 'גרפיקה לכבוד סיום התואר 2');
                                                        assert.deepEqual(activeProcess2.processUrgency, 2);
                                                        assert.deepEqual(activeProcess2.currentStages, [3]);
                                                        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                                            comments: 'הערות של סגן מנהל נגטיב',
                                                            2: 'on',
                                                            processName: 'גרפיקה לכבוד סיום התואר 1'
                                                        }, [], (err5) => {
                                                            if (err5) {
                                                                done(err5);
                                                            }
                                                            else {
                                                                activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err6, activeProcesses4) => {
                                                                    if (err6) {
                                                                        done(err6);
                                                                    }
                                                                    else {
                                                                        assert.deepEqual(activeProcesses4.length, 2);
                                                                        let activeProcess1 = activeProcesses4[0];
                                                                        assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                        assert.deepEqual(activeProcess1.processName, 'גרפיקה לכבוד סיום התואר 1');
                                                                        assert.deepEqual(activeProcess1.processUrgency, 1);
                                                                        assert.deepEqual(activeProcess1.currentStages, [2]);
                                                                        let activeProcess2 = activeProcesses4[1];
                                                                        assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                        assert.deepEqual(activeProcess2.processName, 'גרפיקה לכבוד סיום התואר 2');
                                                                        assert.deepEqual(activeProcess2.processUrgency, 2);
                                                                        assert.deepEqual(activeProcess2.currentStages, [3]);
                                                                        activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                                                                            comments: 'הערות של מנהל נגטיב',
                                                                            4: 'on',
                                                                            processName: 'גרפיקה לכבוד סיום התואר 1'
                                                                        }, [], (err7) => {
                                                                            if (err7) {
                                                                                done(err7);
                                                                            }
                                                                            else {
                                                                                activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err8, activeProcesses5) => {
                                                                                    if (err8) {
                                                                                        done(err8);
                                                                                    }
                                                                                    else {
                                                                                        assert.deepEqual(activeProcesses5.length, 2);
                                                                                        let activeProcess1 = activeProcesses5[0];
                                                                                        assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                        assert.deepEqual(activeProcess1.processName, 'גרפיקה לכבוד סיום התואר 1');
                                                                                        assert.deepEqual(activeProcess1.processUrgency, 1);
                                                                                        assert.deepEqual(activeProcess1.currentStages, [4]);
                                                                                        let activeProcess2 = activeProcesses5[1];
                                                                                        assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                        assert.deepEqual(activeProcess2.processName, 'גרפיקה לכבוד סיום התואר 2');
                                                                                        assert.deepEqual(activeProcess2.processUrgency, 2);
                                                                                        assert.deepEqual(activeProcess2.currentStages, [3]);
                                                                                        activeProcessController.uploadFilesAndHandleProcess('publicitydepartmenthead@outlook.co.il', {
                                                                                            comments: 'הערות של רמד הסברה',
                                                                                            processName: 'גרפיקה לכבוד סיום התואר 1'
                                                                                        }, [], (err9) => {
                                                                                            if (err9) {
                                                                                                done(err9);
                                                                                            }
                                                                                            else {
                                                                                                activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err10, activeProcesses6) => {
                                                                                                    if (err10) {
                                                                                                        done(err10);
                                                                                                    }
                                                                                                    else {
                                                                                                        assert.deepEqual(activeProcesses6.length, 1);
                                                                                                        let activeProcess1 = activeProcesses6[0];
                                                                                                        assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                                        assert.deepEqual(activeProcess1.processName, 'גרפיקה לכבוד סיום התואר 2');
                                                                                                        assert.deepEqual(activeProcess1.processUrgency, 2);
                                                                                                        assert.deepEqual(activeProcess1.currentStages, [3]);
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
                    });
                }
            });
        }).timeout(30000);
    });
    describe('1.5 getActiveProcessByProcessName', function () {
    });
    describe('1.6 replaceRoleIDWithRoleNameAndUserEmailWithUserName', function () {
        let processStages = [];
        let activeProcessStage1 = new activeProcessStage({
            roleID: '5ccc403ff73ca359c88cea85', kind: '', dereg: '',
            stageNum: 1, nextStages: [2],
            stagesToWaitFor: [],
            originStagesToWaitFor: [],
            userEmail: 'spokesperson@outlook.co.il',
            approvalTime: null, assignmentTime: null, notificationsCycle: 12
        });
        let activeProcessStage2 = new activeProcessStage({
            roleID: '5ccc403ff73ca359c88cea8a', kind: '', dereg: '',
            stageNum: 1, nextStages: [2],
            stagesToWaitFor: [],
            originStagesToWaitFor: [],
            userEmail: 'negativemanager@outlook.co.il',
            approvalTime: null, assignmentTime: null, notificationsCycle: 12
        });
        processStages.push(activeProcessStage1);
        processStages.push(activeProcessStage2);
        let activeProcess1 = new activeProcess({
            processName: 'ערב פוקר שבועי', creatorUserEmail: 'tomerlev1000@gmail.com',
            processDate: new Date(), processUrgency: 3, creationTime: new Date(),
            notificationTime: 12, automaticAdvanceTime: 12, currentStages: [3], onlineForms: [],
            filledOnlineForms: [], lastApproached: new Date(), stageToReturnTo: [1]
        }, processStages);
        activeProcessController.replaceRoleIDWithRoleNameAndUserEmailWithUserName([activeProcess1], (err, activeProcesses) => {
            if (err) {
                done(err);
            }
            else {
                assert.deepEqual(activeProcesses.length, 1);
                done();
            }
        });
    });
    describe('1.7 convertDate', function () {
    });
});