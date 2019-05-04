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
let userAccessor = require('../../models/accessors/usersAccessor');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let processStructureSankeyJSON = require('../inputs/processStructures/processStructuresForActiveProcessTest/processStructure1');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let processReportContoller = require('../../controllers/processesControllers/processReportController');
let processReportAccessor = require('../../models/accessors/processReportAccessor');

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

describe('1. Process Report Controller', function () {
    before(beforeGlobal);
    beforeEach(beforeEachTest);
    after(afterGlobal);
    describe('1.1 addProcessReport', function () {
        it('1.1.1 Create new process report.', function (done) {
            processReportContoller.addProcessReport('Process Name 1', new Date(), new Date(), 1, 'tomerlev1000@gmail.com', (err1, result) => {
                if (err1) {
                    done(err1);
                }
                else {
                    processReportAccessor.findProcessReport({processName: 'Process Name 1'}, (err2, report) => {
                        if (err2) {
                            done(err2);
                        }
                        else {
                            assert.deepEqual(report.attachedFilesNames, []);
                            assert.deepEqual(report.filledOnlineForms, []);
                            assert.deepEqual(report.processCreatorEmail, 'tomerlev1000@gmail.com');
                            assert.deepEqual(report.processName, 'Process Name 1');
                            assert.deepEqual(report.processUrgency, 1);
                            assert.deepEqual(report.status, 'פעיל');
                            done();
                        }
                    });
                }
            });
        }).timeout(30000);
    });
    describe('1.2 addActiveProcessDetailsToReport', function () {
        it('1.2.1 Add new stages to the report.', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לכבוד הנוקמים', new Date(2018, 11, 24, 10, 33, 30, 0), 1, (err1, result1) => {
                if (err1) {
                    done(err1);
                }
                else {
                    let stage1 = {
                        comments: 'Comment 1',
                        filledForms: [],
                        fileNames: [],
                        action: 'continue',
                        stageNum: 2
                    };
                    let stage2 = {
                        comments: 'Comment 2',
                        filledForms: [],
                        fileNames: [],
                        action: 'continue',
                        stageNum: 3
                    };
                    let stage3 = {
                        comments: 'Comment 3',
                        filledForms: [],
                        fileNames: [],
                        action: 'cancel',
                        stageNum: 4
                    };
                    processReportContoller.addActiveProcessDetailsToReport('גרפיקה לכבוד הנוקמים', 'negativevicemanager@outlook.co.il', stage1, new Date(), (err2, result2) => {
                        if (err2) {
                            done(err2)
                        }
                        else {
                            processReportContoller.addActiveProcessDetailsToReport('גרפיקה לכבוד הנוקמים', 'negativevicemanager@outlook.co.il', stage2, new Date(), (err3, result3) => {
                                if (err3) {
                                    done(err3)
                                }
                                else {
                                    processReportContoller.addActiveProcessDetailsToReport('גרפיקה לכבוד הנוקמים', 'negativevicemanager@outlook.co.il', stage3, new Date(), (err4, result3) => {
                                        if (err4) {
                                            done(err4)
                                        }
                                        else {
                                            processReportAccessor.findProcessReport({processName: 'גרפיקה לכבוד הנוקמים'}, (err5, report) => {
                                                if (err5) {
                                                    done(err5);
                                                }
                                                else {
                                                    assert.deepEqual(report.attachedFilesNames, []);
                                                    assert.deepEqual(report.filledOnlineForms, []);
                                                    assert.deepEqual(report.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(report.processName, 'גרפיקה לכבוד הנוקמים');
                                                    assert.deepEqual(report.processUrgency, 1);
                                                    assert.deepEqual(report.status, 'פעיל');
                                                    assert.deepEqual(report.stages.length, 3);
                                                    let reportStage1 = report.stages[0];
                                                    assert.deepEqual(reportStage1.action, 'continue');
                                                    assert.deepEqual(reportStage1.comments, 'Comment 1');
                                                    assert.deepEqual(reportStage1.roleName, 'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage1.stageNum, 2);
                                                    assert.deepEqual(reportStage1.userEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage1.userName, 'סגן מנהל נגטיב');
                                                    let reportStage2 = report.stages[1];
                                                    assert.deepEqual(reportStage2.action, 'continue');
                                                    assert.deepEqual(reportStage2.comments, 'Comment 2');
                                                    assert.deepEqual(reportStage2.roleName, 'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage2.stageNum, 3);
                                                    assert.deepEqual(reportStage2.userEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage2.userName, 'סגן מנהל נגטיב');
                                                    let reportStage3 = report.stages[2];
                                                    assert.deepEqual(reportStage3.action, 'cancel');
                                                    assert.deepEqual(reportStage3.comments, 'Comment 3');
                                                    assert.deepEqual(reportStage3.roleName, 'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage3.stageNum, 4);
                                                    assert.deepEqual(reportStage3.userEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage3.userName, 'סגן מנהל נגטיב');
                                                    done();
                                                }
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });
        }).timeout(30000);
    });
    describe('1.3 getAllProcessesReportsByUser', function () {
        it('1.3.1 Get all the process report of someone and his children..', function (done) {
            processReportContoller.addProcessReport('New Process Name 1', new Date(), new Date(), 1, 'negativevicemanager@outlook.co.il', (err1, result1) => {
                if (err1) {
                    done(err1);
                }
                else {
                    processReportContoller.addProcessReport('New Process Name 2', new Date(), new Date(), 2, 'negativevicemanager@outlook.co.il', (err2, result2) => {
                        if (err2) {
                            done(err2);
                        }
                        else {
                            processReportContoller.addProcessReport('New Process Name 3', new Date(), new Date(), 3, 'negativemanager@outlook.co.il', (err3, result3) => {
                                if (err3) {
                                    done(err3);
                                }
                                else {
                                    processReportContoller.getAllProcessesReportsByUser('negativevicemanager@outlook.co.il', (err4, result4) => {
                                        if (err4) {
                                            done(err4)
                                        }
                                        else {
                                            assert.deepEqual(result4.length, 2);
                                            let reportNumber1 = result4[0];
                                            assert.deepEqual(reportNumber1.attachedFilesNames, []);
                                            assert.deepEqual(reportNumber1.filledOnlineForms, []);
                                            assert.deepEqual(reportNumber1.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(reportNumber1.processName, 'New Process Name 1');
                                            assert.deepEqual(reportNumber1.processUrgency, 1);
                                            assert.deepEqual(reportNumber1.status, 'פעיל');
                                            assert.deepEqual(reportNumber1.stages, []);
                                            let reportNumber2 = result4[1];
                                            assert.deepEqual(reportNumber2.attachedFilesNames, []);
                                            assert.deepEqual(reportNumber2.filledOnlineForms, []);
                                            assert.deepEqual(reportNumber2.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(reportNumber2.processName, 'New Process Name 2');
                                            assert.deepEqual(reportNumber2.processUrgency, 2);
                                            assert.deepEqual(reportNumber2.status, 'פעיל');
                                            assert.deepEqual(reportNumber2.stages, []);
                                            processReportContoller.getAllProcessesReportsByUser('negativemanager@outlook.co.il', (err5, result5) => {
                                                if (err5) {
                                                    done(err5)
                                                }
                                                else {
                                                    assert.deepEqual(result5.length, 3);
                                                    let reportNumber1 = result5[0];
                                                    assert.deepEqual(reportNumber1.attachedFilesNames, []);
                                                    assert.deepEqual(reportNumber1.filledOnlineForms, []);
                                                    assert.deepEqual(reportNumber1.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportNumber1.processName, 'New Process Name 1');
                                                    assert.deepEqual(reportNumber1.processUrgency, 1);
                                                    assert.deepEqual(reportNumber1.status, 'פעיל');
                                                    assert.deepEqual(reportNumber1.stages, []);
                                                    let reportNumber2 = result5[1];
                                                    assert.deepEqual(reportNumber2.attachedFilesNames, []);
                                                    assert.deepEqual(reportNumber2.filledOnlineForms, []);
                                                    assert.deepEqual(reportNumber2.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportNumber2.processName, 'New Process Name 2');
                                                    assert.deepEqual(reportNumber2.processUrgency, 2);
                                                    assert.deepEqual(reportNumber2.status, 'פעיל');
                                                    assert.deepEqual(reportNumber2.stages, []);
                                                    let reportNumber3 = result5[2];
                                                    assert.deepEqual(reportNumber3.attachedFilesNames, []);
                                                    assert.deepEqual(reportNumber3.filledOnlineForms, []);
                                                    assert.deepEqual(reportNumber3.processCreatorEmail, 'negativemanager@outlook.co.il');
                                                    assert.deepEqual(reportNumber3.processName, 'New Process Name 3');
                                                    assert.deepEqual(reportNumber3.processUrgency, 3);
                                                    assert.deepEqual(reportNumber3.status, 'פעיל');
                                                    assert.deepEqual(reportNumber3.stages, []);
                                                    done();
                                                }
                                            })
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    });
    describe('1.4 processReport', function () {
        it('1.4.1 Get process report.', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לחג', new Date(), 1, (err1, result1) => {
                if (err1) {
                    done(err1);
                }
                else {
                    let stage1 = {
                        comments: 'Comment 1',
                        filledForms: [],
                        fileNames: [],
                        action: 'continue',
                        stageNum: 2
                    };
                    let stage2 = {
                        comments: 'Comment 2',
                        filledForms: [],
                        fileNames: [],
                        action: 'continue',
                        stageNum: 3
                    };
                    let stage3 = {
                        comments: 'Comment 3',
                        filledForms: [],
                        fileNames: [],
                        action: 'cancel',
                        stageNum: 4
                    };
                    processReportContoller.addActiveProcessDetailsToReport('גרפיקה לחג', 'negativevicemanager@outlook.co.il', stage1, new Date(), (err2, result2) => {
                        if (err2) {
                            done(err2)
                        }
                        else {
                            processReportContoller.addActiveProcessDetailsToReport('גרפיקה לחג', 'negativevicemanager@outlook.co.il', stage2, new Date(), (err3, result3) => {
                                if (err3) {
                                    done(err3)
                                }
                                else {
                                    processReportContoller.addActiveProcessDetailsToReport('גרפיקה לחג', 'negativevicemanager@outlook.co.il', stage3, new Date(), (err4, result3) => {
                                        if (err4) {
                                            done(err4)
                                        }
                                        else {
                                            processReportContoller.processReport('גרפיקה לחג', (err5, report) => {
                                                if (err5) {
                                                    done(err5);
                                                }
                                                else {
                                                    let reportHeader = report[0];
                                                    let reportStages = report[1];
                                                    assert.deepEqual(reportHeader.filledOnlineForms, []);
                                                    assert.deepEqual(reportHeader.processName, 'גרפיקה לחג');
                                                    assert.deepEqual(reportHeader.urgency, 1);
                                                    assert.deepEqual(reportHeader.status, 'פעיל');
                                                    let reportStage1 = reportStages[0];
                                                    assert.deepEqual(reportStage1.action, 'continue');
                                                    assert.deepEqual(reportStage1.comments, 'Comment 1');
                                                    assert.deepEqual(reportStage1.roleName, 'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage1.stageNum, 2);
                                                    assert.deepEqual(reportStage1.userEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage1.userName, 'סגן מנהל נגטיב');
                                                    let reportStage2 = reportStages[1];
                                                    assert.deepEqual(reportStage2.action, 'continue');
                                                    assert.deepEqual(reportStage2.comments, 'Comment 2');
                                                    assert.deepEqual(reportStage2.roleName, 'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage2.stageNum, 3);
                                                    assert.deepEqual(reportStage2.userEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage2.userName, 'סגן מנהל נגטיב');
                                                    let reportStage3 = reportStages[2];
                                                    assert.deepEqual(reportStage3.action, 'cancel');
                                                    assert.deepEqual(reportStage3.comments, 'Comment 3');
                                                    assert.deepEqual(reportStage3.roleName, 'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage3.stageNum, 4);
                                                    assert.deepEqual(reportStage3.userEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage3.userName, 'סגן מנהל נגטיב');
                                                    done();
                                                }
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });
        }).timeout(30000);
    });
    describe('1.5 getAllActiveProcessDetails', function () {
        it('1.5.1 Get active process details.', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לחג', new Date(), 1, (err1, result1) => {
                if (err1) {
                    done(err1);
                }
                else {
                    let stage1 = {
                        comments: 'Comment 1',
                        filledForms: [],
                        fileNames: [],
                        action: 'continue',
                        stageNum: 2
                    };
                    let stage2 = {
                        comments: 'Comment 2',
                        filledForms: [],
                        fileNames: [],
                        action: 'continue',
                        stageNum: 3
                    };
                    let stage3 = {
                        comments: 'Comment 3',
                        filledForms: [],
                        fileNames: [],
                        action: 'cancel',
                        stageNum: 4
                    };
                    processReportContoller.addActiveProcessDetailsToReport('גרפיקה לחג', 'negativevicemanager@outlook.co.il', stage1, new Date(), (err2, result2) => {
                        if (err2) {
                            done(err2)
                        }
                        else {
                            processReportContoller.addActiveProcessDetailsToReport('גרפיקה לחג', 'negativevicemanager@outlook.co.il', stage2, new Date(), (err3, result3) => {
                                if (err3) {
                                    done(err3)
                                }
                                else {
                                    processReportContoller.addActiveProcessDetailsToReport('גרפיקה לחג', 'negativevicemanager@outlook.co.il', stage3, new Date(), (err4, result3) => {
                                        if (err4) {
                                            done(err4)
                                        }
                                        else {
                                            processReportContoller.getAllActiveProcessDetails('גרפיקה לחג', (err5, report) => {
                                                if (err5) {
                                                    done(err5);
                                                }
                                                else {
                                                    let reportHeader = report[0];
                                                    let reportStages = report[1];
                                                    assert.deepEqual(reportHeader.filledOnlineForms, []);
                                                    assert.deepEqual(reportHeader.processName, 'גרפיקה לחג');
                                                    assert.deepEqual(reportHeader.urgency, 1);
                                                    assert.deepEqual(reportHeader.status, 'פעיל');
                                                    let reportStage1 = reportStages[0];
                                                    assert.deepEqual(reportStage1.action, 'continue');
                                                    assert.deepEqual(reportStage1.comments, 'Comment 1');
                                                    assert.deepEqual(reportStage1.roleName, 'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage1.stageNum, 2);
                                                    assert.deepEqual(reportStage1.userEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage1.userName, 'סגן מנהל נגטיב');
                                                    let reportStage2 = reportStages[1];
                                                    assert.deepEqual(reportStage2.action, 'continue');
                                                    assert.deepEqual(reportStage2.comments, 'Comment 2');
                                                    assert.deepEqual(reportStage2.roleName, 'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage2.stageNum, 3);
                                                    assert.deepEqual(reportStage2.userEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage2.userName, 'סגן מנהל נגטיב');
                                                    let reportStage3 = reportStages[2];
                                                    assert.deepEqual(reportStage3.action, 'cancel');
                                                    assert.deepEqual(reportStage3.comments, 'Comment 3');
                                                    assert.deepEqual(reportStage3.roleName, 'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage3.stageNum, 4);
                                                    assert.deepEqual(reportStage3.userEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage3.userName, 'סגן מנהל נגטיב');
                                                    done();
                                                }
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });
        }).timeout(30000);
    });
    describe('1.6 isExistInReport', function () {
        it('1.6.1 Check if someone is included in report.', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לחג', new Date(), 1, (err1, result1) => {
                if (err1) {
                    done(err1);
                }
                else {
                    let stage1 = {
                        comments: 'Comment 1',
                        filledForms: [],
                        fileNames: [],
                        action: 'continue',
                        stageNum: 2
                    };
                    let stage2 = {
                        comments: 'Comment 2',
                        filledForms: [],
                        fileNames: [],
                        action: 'continue',
                        stageNum: 3
                    };
                    let stage3 = {
                        comments: 'Comment 3',
                        filledForms: [],
                        fileNames: [],
                        action: 'cancel',
                        stageNum: 4
                    };
                    processReportContoller.addActiveProcessDetailsToReport('גרפיקה לחג', 'negativevicemanager@outlook.co.il', stage1, new Date(), (err2, result2) => {
                        if (err2) {
                            done(err2)
                        }
                        else {
                            processReportContoller.addActiveProcessDetailsToReport('גרפיקה לחג', 'negativevicemanager@outlook.co.il', stage2, new Date(), (err3, result3) => {
                                if (err3) {
                                    done(err3)
                                }
                                else {
                                    processReportContoller.addActiveProcessDetailsToReport('גרפיקה לחג', 'negativevicemanager@outlook.co.il', stage3, new Date(), (err4, result3) => {
                                        if (err4) {
                                            done(err4)
                                        }
                                        else {
                                            processReportContoller.getAllProcessesReportsByUser('negativevicemanager@outlook.co.il', (err5, report) => {
                                                if (err5) {
                                                    done(err5);
                                                }
                                                else {
                                                    let isIncluded = processReportContoller.isExistInReport(report[0], 'negativevicemanager@outlook.co.il');
                                                    let isNotIncluded = processReportContoller.isExistInReport(report[0], 'negativemanager@outlook.co.il');
                                                    assert.deepEqual(isIncluded, true);
                                                    assert.deepEqual(isNotIncluded, false);
                                                    done();
                                                }
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });
        });
    }).timeout(30000);
    describe('1.7 convertDate', function () {
        it('1.7.1 Check the date conversion.', function (done) {
            processReportContoller.addProcessReport('New Process Name 1', new Date(2017, 1, 1, 10, 30, 0, 0), new Date(2017, 1, 1, 10, 30, 0, 0), 1, 'negativevicemanager@outlook.co.il', (err1, result1) => {
                if (err1) {
                    done(err1);
                }
                else {
                    processReportContoller.addProcessReport('New Process Name 2', new Date(2018, 2, 2, 11, 35, 0, 0), new Date(2018, 2, 2, 11, 35, 0, 0), 2, 'negativevicemanager@outlook.co.il', (err2, result2) => {
                        if (err2) {
                            done(err2);
                        }
                        else {
                            processReportContoller.addProcessReport('New Process Name 3', new Date(2019, 3, 3, 12, 40, 0, 0), new Date(2019, 3, 3, 12, 40, 0, 0), 3, 'negativevicemanager@outlook.co.il', (err3, result3) => {
                                if (err3) {
                                    done(err3);
                                }
                                else {
                                    processReportContoller.getAllProcessesReportsByUser('negativevicemanager@outlook.co.il', (err4, result4) => {
                                        if (err4) {
                                            done(err4)
                                        }
                                        else {
                                            assert.deepEqual(result4.length, 3);
                                            processReportContoller.convertDate(result4);
                                            let reportNumber1 = result4[0];
                                            assert.deepEqual(reportNumber1.processDate, '01/02/2017 10:30:00');
                                            assert.deepEqual(reportNumber1.attachedFilesNames, []);
                                            assert.deepEqual(reportNumber1.filledOnlineForms, []);
                                            assert.deepEqual(reportNumber1.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(reportNumber1.processName, 'New Process Name 1');
                                            assert.deepEqual(reportNumber1.processUrgency, 1);
                                            assert.deepEqual(reportNumber1.status, 'פעיל');
                                            assert.deepEqual(reportNumber1.stages, []);
                                            let reportNumber2 = result4[1];
                                            assert.deepEqual(reportNumber2.processDate, '02/03/2018 11:35:00');
                                            assert.deepEqual(reportNumber2.attachedFilesNames, []);
                                            assert.deepEqual(reportNumber2.filledOnlineForms, []);
                                            assert.deepEqual(reportNumber2.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(reportNumber2.processName, 'New Process Name 2');
                                            assert.deepEqual(reportNumber2.processUrgency, 2);
                                            assert.deepEqual(reportNumber2.status, 'פעיל');
                                            assert.deepEqual(reportNumber2.stages, []);
                                            let reportNumber3 = result4[2];
                                            assert.deepEqual(reportNumber3.processDate, '03/04/2019 12:40:00');
                                            assert.deepEqual(reportNumber3.attachedFilesNames, []);
                                            assert.deepEqual(reportNumber3.filledOnlineForms, []);
                                            assert.deepEqual(reportNumber3.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(reportNumber3.processName, 'New Process Name 3');
                                            assert.deepEqual(reportNumber3.processUrgency, 3);
                                            assert.deepEqual(reportNumber3.status, 'פעיל');
                                            assert.deepEqual(reportNumber3.stages, []);
                                            done();
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    }).timeout(30000);
});