let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let fs = require('fs');
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
let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let usersAndRolesAccessor = require('../../models/accessors/usersAccessor');
let notificationsController = require('../../controllers/notificationsControllers/notificationController');
let usersAndRolesTree = require('../../domainObjects/usersAndRolesTree');
let processReportController = require('../../controllers/processesControllers/processReportController');

//Graphics Inputs
let sankeyContentOfGraphics = require('../inputs/trees/GraphicsTree/sankeyTree');
let emailsToFullNameOfGraphics = require('../inputs/trees/GraphicsTree/emailsToFullName');
let rolesToDeregOfGraphics = require('../inputs/trees/GraphicsTree/rolesToDereg');
let rolesToEmailsOfGraphics = require('../inputs/trees/GraphicsTree/rolesToEmails');
let processStructureSankeyJSONOfGraphics = require('../inputs/processStructures/GraphicsProcessStructure/graphicsSankey');
//End Of Graphics Inputs

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
            done();
        }
    });
};
let createTree1WithStructure1 = function (done) {
    UsersAndRolesTreeSankey.setUsersAndRolesTree('chairman@outlook.co.il', JSON.stringify(sankeyContent),
        rolesToEmails, emailsToFullName,
        rolesToDereg, (err) => {
            if (err) {
                done(err);
            }
            else {
                onlineFormsController.findOnlineFormsIDsByFormsNames(['טופס קניות'], (err, formIDsArray) => {
                    processStructureController.addProcessStructure('chairman@outlook.co.il', 'תהליך גרפיקה', JSON.stringify(processStructureSankeyJSON), [], 0, "12", (err, needApproval) => {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    });
                });
            }
        });
};

let createTreeAndProcessStructureOfGrahics = function (done) {
    UsersAndRolesTreeSankey.setUsersAndRolesTree('chairman@outlook.co.il', JSON.stringify(sankeyContentOfGraphics),
        rolesToEmailsOfGraphics, emailsToFullNameOfGraphics,
        rolesToDeregOfGraphics, (err) => {
            if (err) {
                done(err);
            }
            else {
                onlineFormsController.findOnlineFormsIDsByFormsNames(['טופס קניות'], (err, formIDsArray) => {
                    processStructureController.addProcessStructure('chairman@outlook.co.il', 'תהליך גרפיקה', JSON.stringify(processStructureSankeyJSONOfGraphics), [], 0, "12", (err, needApproval) => {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    });
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
            }, [], 'files', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                        comments: 'הערות של מנהל נגטיב',
                        0: 'on',
                        1: 'on',
                        4: 'on',
                        processName: 'גרפיקה להקרנת בכורה'
                    }, [], 'files', (err) => {
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

let startProcessAndHandleTwiceWithGraphicsAndPublicity = function (done) {
    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
        if (err) done(err);
        else {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, [], 'files', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                        comments: 'הערות של מנהל נגטיב',
                        1: 'on',
                        4: 'on',
                        processName: 'גרפיקה להקרנת בכורה'
                    }, [],'files', (err) => {
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
    describe('1.1 start process', function () {
        beforeEach(createTree1WithStructure1);
        it('1.1.1 start process userEmail not in tree', function (done) {
            activeProcessController.startProcessByUsername('chairman@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, '>>> ERROR: username chairman@outlook.co.il don\'t have the proper role to start the process תהליך גרפיקה');
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(true, process === null);
                        done();
                    }
                });
            });
        }).timeout(30000);

        it('1.1.2 start process process structure doesn\'t exist', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גלפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, 'This process structure is currently unavailable due to changes in roles');
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(true, process === null);
                        done();
                    }
                });
            });
        }).timeout(30000);

        it('1.1.3 start process correct', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(true, process !== null);
                            processReportController.processReport('גרפיקה להקרנת בכורה', (err, report) => {
                                if (err) done(err);
                                else {
                                    assert.deepEqual(report[1].length, 0);
                                    assert.deepEqual(report[0].processName, 'גרפיקה להקרנת בכורה');
                                    assert.deepEqual(report[0].status, 'פעיל');
                                    assert.deepEqual(report[0].urgency, 3);
                                    assert.deepEqual(report[0].filledOnlineForms, []);
                                    notificationsController.getUserNotifications('negativevicemanager@outlook.co.il', (err, results) => {
                                        if (err) done(err);
                                        else {
                                            assert.deepEqual(results.length, 1);
                                            assert.deepEqual(results[0].description, 'גרפיקה להקרנת בכורה מסוג תהליך גרפיקה מחכה לטיפולך.');
                                            assert.deepEqual(results[0].notificationType, 'תהליך בהמתנה');
                                            done();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.1.4 start process user cant start process', function (done) {
            activeProcessController.startProcessByUsername('chairman@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, '>>> ERROR: username chairman@outlook.co.il don\'t have the proper role to start the process תהליך גרפיקה');
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(true, process === null);
                        done();
                    }
                });
            });
        }).timeout(30000);

        it('1.1.5 start process process structure is unavailable', function (done) {
            processStructureAccessor.updateProcessStructure({structureName: 'תהליך גרפיקה'}, {$set: {available: false}}, (err) => {
                if (err) done(err);
                else {
                    activeProcessController.startProcessByUsername('chairman@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                        assert.deepEqual(true, err !== null);
                        assert.deepEqual(err.message, 'This process structure is currently unavailable due to changes in roles');
                        activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(true, process === null);
                                done();
                            }
                        });
                    });
                }
            });

        }).timeout(30000);

        it('1.1.6 start process same name', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                if (err) done(err);
                else {
                    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                        assert.deepEqual(true, err !== null);
                        activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(true, process !== null);
                                done();
                            }
                        });
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.2 uploadFilesAndHandleProcess', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        afterEach((done) => {
            fs.rename('test/fileTests/outputFiles/גרפיקה להקרנת בכורה/a.txt', 'test/fileTests/inputFiles/a.txt', function (err) {
                if (err) done(err);
                else {
                    fs.rename('test/fileTests/outputFiles/גרפיקה להקרנת בכורה/b.txt', 'test/fileTests/inputFiles/b.txt', function (err) {
                        if (err) done(err);
                        else {
                            fs.rmdirSync('test/fileTests/outputFiles/גרפיקה להקרנת בכורה');
                            fs.rmdirSync('test/fileTests/outputFiles');
                            done();
                        }
                    });
                }
            });
        });
        it('1.2.1 uploadFilesAndHandleProcess', function (done) {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, {
                "a": {name: 'a.txt', path: 'test/fileTests/inputFiles/a.txt'},
                "b": {name: 'b.txt', path: 'test/fileTests/inputFiles/b.txt'}
            }, 'test/fileTests/outputFiles', (err) => {
                if (err) done(err);
                else {
                    assert.deepEqual(fs.existsSync('test/fileTests/outputFiles/גרפיקה להקרנת בכורה/a.txt'), true);
                    assert.deepEqual(fs.existsSync('test/fileTests/outputFiles/גרפיקה להקרנת בכורה/b.txt'), true);
                    done();
                }
            });
        }).timeout(30000);
    });


    describe('1.2 assign single users', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcessAndHandleTwice);
        it('1.2.1 assign single users', function (done) {
            activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                if (err) done(err);
                else {
                    activeProcessController.assignSingleUsersToStages(process, [0, 1, 4], (err, result) => {
                        if (err) done(err);
                        else {
                            activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                if (err) done(err);
                                else {
                                    assert.deepEqual(null, process.getStageByStageNum(0).userEmail);
                                    assert.deepEqual(null, process.getStageByStageNum(1).userEmail);
                                    assert.deepEqual('publicitydepartmenthead@outlook.co.il', process.getStageByStageNum(4).userEmail);
                                    done();
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.3 cancel process', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        it('1.3.1 cancel process', function (done) {
            activeProcessController.cancelProcess('negativevicemanager@outlook.co.il', 'גרפיקה להקרנת בכורה', 'הערות לביטול', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(true, process === null);
                            done()
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.4 incrementStageCycle', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        it('1.4.1 incrementStageCycle', function (done) {
            activeProcessController.incrementStageCycle('גרפיקה להקרנת בכורה', [0, 1, 4], (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(2, process.getStageByStageNum(0).notificationsCycle);
                            assert.deepEqual(2, process.getStageByStageNum(1).notificationsCycle);
                            assert.deepEqual(2, process.getStageByStageNum(4).notificationsCycle);
                            assert.deepEqual(1, process.getStageByStageNum(2).notificationsCycle);
                            assert.deepEqual(1, process.getStageByStageNum(3).notificationsCycle);
                            activeProcessController.incrementStageCycle('גרפיקה להקרנת בכורה', [2, 1, 4], (err) => {
                                if (err) done(err);
                                else {
                                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                        if (err) done(err);
                                        else {
                                            assert.deepEqual(2, process.getStageByStageNum(0).notificationsCycle);
                                            assert.deepEqual(3, process.getStageByStageNum(1).notificationsCycle);
                                            assert.deepEqual(3, process.getStageByStageNum(4).notificationsCycle);
                                            assert.deepEqual(2, process.getStageByStageNum(2).notificationsCycle);
                                            assert.deepEqual(1, process.getStageByStageNum(3).notificationsCycle);
                                            done();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.5 handleProcess', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        it('1.5.1 handleProcess without finishing correct', function (done) {
            activeProcessController.handleProcess('negativevicemanager@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                comments: 'הערות של סגן מנהל נגטיב',
                fileNames: ['קובץ 2', 'קובץ1'],
                nextStageRoles: []
            }, (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(true, process === null);
                            done()
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.5.2 handleProcess with finishing correct', function (done) {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, [],'files', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                        comments: 'הערות של מנהל נגטיב',
                        4: 'on',
                        processName: 'גרפיקה להקרנת בכורה'
                    }, [],'files', (err) => {
                        if (err) done(err);
                        else {
                            activeProcessController.handleProcess('publicitydepartmenthead@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                                comments: '',
                                fileNames: ['קובץ 2', 'קובץ1'],
                                nextStageRoles: []
                            }, (err) => {
                                if (err) done(err);
                                else {
                                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                        if (err) done(err);
                                        else {
                                            assert.deepEqual(true, process === null);
                                            done()
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
        it('1.5.3 handleProcess without finishing wrong user', function (done) {
            activeProcessController.handleProcess('negativemanager@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                comments: 'הערות של סגן מנהל נגטיב',
                fileNames: ['קובץ 2', 'קובץ1'],
                nextStageRoles: [2]
            }, (err) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, 'HandleProcess: user not found in current stages');
                done();
            });
        }).timeout(30000);

        it('1.5.3 handleProcess without finishing wrong next stages', function (done) {
            activeProcessController.handleProcess('negativevicemanager@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                comments: 'הערות של סגן מנהל נגטיב',
                fileNames: ['קובץ 2', 'קובץ1'],
                nextStageRoles: [2, 4]
            }, (err) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, 'HandleProcess: next stages are wrong');
                done();
            });
        }).timeout(30000);

        it('1.5.4 handleProcess with finishing wrong next stages', function (done) {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, [],'files', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                        comments: 'הערות של מנהל נגטיב',
                        4: 'on',
                        processName: 'גרפיקה להקרנת בכורה'
                    }, [],'files', (err) => {
                        if (err) done(err);
                        else {
                            activeProcessController.handleProcess('publicitydepartmenthead@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                                comments: '',
                                fileNames: ['קובץ 2', 'קובץ1'],
                                nextStageRoles: [1]
                            }, (err) => {
                                assert.deepEqual(true, err !== null);
                                assert.deepEqual(err.message, 'HandleProcess: next stages are wrong');
                                done();
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.6 advance process', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        it('1.6.1 advanceProcess', function (done) {
            activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                if (err) done(err);
                else {
                    process.handleStage({stageNum: 3});
                    activeProcessController.advanceProcess(process, 3, [2], (err) => {
                        if (err) done(err);
                        else {
                            done();
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.7 takePartInProcess', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcessAndHandleTwiceWithGraphicsAndPublicity);
        it('1.7.1 takePartInProcess', function (done) {
            activeProcessController.takePartInActiveProcess('גרפיקה להקרנת בכורה', 'graphicartist@outlook.co.il', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual('graphicartist@outlook.co.il', process.getStageByStageNum(1).userEmail);
                            done();
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.8 unTakePartInProcess', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcessAndHandleTwiceWithGraphicsAndPublicity);
        it('1.8.1 unTakePartInProcess', function (done) {
            activeProcessController.unTakePartInActiveProcess('גרפיקה להקרנת בכורה', 'publicitydepartmenthead@outlook.co.il', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(null, process.getStageByStageNum(4).userEmail);
                            done();
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.9 returnToCreator', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcessAndHandleTwiceWithGraphicsAndPublicity);
        it('1.9.1 returnToCreator correct', function (done) {
            activeProcessController.returnToCreator('publicitydepartmenthead@outlook.co.il', 'גרפיקה להקרנת בכורה', 'הערות חזרה', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual([3], process.currentStages);
                            done();
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.9.2 returnToCreator wrong user', function (done) {
            activeProcessController.returnToCreator('publicitydepartmenthead1@outlook.co.il', 'גרפיקה להקרנת בכורה', 'הערות חזרה', (err) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, 'Return To Creator: wrong userEmail');
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual([1, 4], process.currentStages.sort());
                        done();
                    }
                });
            });
        }).timeout(30000);
    });

    describe('1.10 addFilledOnlineFormToProcess', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcessAndHandleTwiceWithGraphicsAndPublicity);
        it('1.10.1 addFilledOnlineFormToProcess', function (done) {
            filledOnlineFormsController.createFilledOnlineFrom('טופס קניות', [{'name': 'blah'}], (err, dbForm) => {
                if (err) done(err);
                else {
                    activeProcessController.addFilledOnlineFormToProcess('גרפיקה להקרנת בכורה', dbForm._id, (err) => {
                        if (err) done(err);
                        else {
                            activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                if (err) done(err);
                                else {
                                    assert.deepEqual(process.filledOnlineForms, [dbForm._id]);
                                    done();
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.11 getNextStagesRolesAndOnlineForms', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        it('1.11.1 getNextStagesRolesAndOnlineForms correct', function (done) {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, [],'files', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getNextStagesRolesAndOnlineForms('גרפיקה להקרנת בכורה', 'negativemanager@outlook.co.il', (err, result) => {
                        if (err) done(err);
                        else {
                            let sortedResult = result[0].sort((x, y) => {
                                if (x[1] < y[1]) return -1;
                                if (x[1] > y[1]) return 1;
                                return 0;
                            });
                            assert.deepEqual(result[0].length, 3);
                            assert.deepEqual(sortedResult[0], ['דובר', 0]);
                            assert.deepEqual(sortedResult[1], ['גרפיקאי', 1]);
                            assert.deepEqual(sortedResult[2], ['רמד הסברה', 4]);
                            done();
                        }
                    })
                }
            });
        }).timeout(30000);

        it('1.11.2 getNextStagesRolesAndOnlineForms user is wrong', function (done) {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, [],'files', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getNextStagesRolesAndOnlineForms('גרפיקה להקרנת בכורה', 'negativevicemanager1@outlook.co.il', (err, result) => {
                        assert.deepEqual(true, err !== null);
                        assert.deepEqual(err.message, 'GetNextStagesRolesAndOnlineForms: user not found in current stages');
                        done();
                    })
                }
            });
        }).timeout(30000);
    });
});