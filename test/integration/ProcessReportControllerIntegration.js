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
let processReportContoller = require('../../controllers/processesControllers/processReportController');
let activeProcess = require('../../domainObjects/activeProcess');
let activeProcessStage = require('../../domainObjects/activeProcessStage');
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
                    processReportContoller.addActiveProcessDetailsToReport('גרפיקה לכבוד הנוקמים','negativevicemanager@outlook.co.il',stage1,new Date(),(err2,result2) =>
                    {
                        if(err2)
                        {
                            done(err2)
                        }
                        else
                        {
                            processReportContoller.addActiveProcessDetailsToReport('גרפיקה לכבוד הנוקמים','negativevicemanager@outlook.co.il',stage2,new Date(),(err3,result3) =>
                            {
                                if(err3)
                                {
                                    done(err3)
                                }
                                else
                                {
                                    processReportContoller.addActiveProcessDetailsToReport('גרפיקה לכבוד הנוקמים','negativevicemanager@outlook.co.il',stage3,new Date(),(err4,result3) =>
                                    {
                                        if(err4)
                                        {
                                            done(err4)
                                        }
                                        else
                                        {
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
                                                    assert.deepEqual(reportStage1.action,'continue');
                                                    assert.deepEqual(reportStage1.comments,'Comment 1');
                                                    assert.deepEqual(reportStage1.roleName,'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage1.stageNum,2);
                                                    assert.deepEqual(reportStage1.userEmail,'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage1.userName,'סגן מנהל נגטיב');
                                                    let reportStage2 = report.stages[1];
                                                    assert.deepEqual(reportStage2.action,'continue');
                                                    assert.deepEqual(reportStage2.comments,'Comment 2');
                                                    assert.deepEqual(reportStage2.roleName,'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage2.stageNum,3);
                                                    assert.deepEqual(reportStage2.userEmail,'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage2.userName,'סגן מנהל נגטיב');
                                                    let reportStage3 = report.stages[2];
                                                    assert.deepEqual(reportStage3.action,'cancel');
                                                    assert.deepEqual(reportStage3.comments,'Comment 3');
                                                    assert.deepEqual(reportStage3.roleName,'סגן מנהל מגטיב');
                                                    assert.deepEqual(reportStage3.stageNum,4);
                                                    assert.deepEqual(reportStage3.userEmail,'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportStage3.userName,'סגן מנהל נגטיב');
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
                                    processReportContoller.getAllProcessesReportsByUser('negativevicemanager@outlook.co.il',(err4,result4) =>{
                                        if(err4)
                                        {
                                            done(err4)
                                        }
                                        else
                                        {
                                            assert.deepEqual(result4.length,2);
                                            let reportNumber1 = result4[0];
                                            assert.deepEqual(reportNumber1.attachedFilesNames, []);
                                            assert.deepEqual(reportNumber1.filledOnlineForms, []);
                                            assert.deepEqual(reportNumber1.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(reportNumber1.processName, 'New Process Name 1');
                                            assert.deepEqual(reportNumber1.processUrgency, 1);
                                            assert.deepEqual(reportNumber1.status, 'פעיל');
                                            assert.deepEqual(reportNumber1.stages,[]);
                                            let reportNumber2 = result4[1];
                                            assert.deepEqual(reportNumber2.attachedFilesNames, []);
                                            assert.deepEqual(reportNumber2.filledOnlineForms, []);
                                            assert.deepEqual(reportNumber2.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(reportNumber2.processName, 'New Process Name 2');
                                            assert.deepEqual(reportNumber2.processUrgency, 2);
                                            assert.deepEqual(reportNumber2.status, 'פעיל');
                                            assert.deepEqual(reportNumber2.stages,[]);
                                            processReportContoller.getAllProcessesReportsByUser('negativemanager@outlook.co.il',(err5,result5) =>{
                                                if(err5)
                                                {
                                                    done(err5)
                                                }
                                                else
                                                {
                                                    assert.deepEqual(result5.length,3);
                                                    let reportNumber1 = result5[0];
                                                    assert.deepEqual(reportNumber1.attachedFilesNames, []);
                                                    assert.deepEqual(reportNumber1.filledOnlineForms, []);
                                                    assert.deepEqual(reportNumber1.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportNumber1.processName, 'New Process Name 1');
                                                    assert.deepEqual(reportNumber1.processUrgency, 1);
                                                    assert.deepEqual(reportNumber1.status, 'פעיל');
                                                    assert.deepEqual(reportNumber1.stages,[]);
                                                    let reportNumber2 = result5[1];
                                                    assert.deepEqual(reportNumber2.attachedFilesNames, []);
                                                    assert.deepEqual(reportNumber2.filledOnlineForms, []);
                                                    assert.deepEqual(reportNumber2.processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                                    assert.deepEqual(reportNumber2.processName, 'New Process Name 2');
                                                    assert.deepEqual(reportNumber2.processUrgency, 2);
                                                    assert.deepEqual(reportNumber2.status, 'פעיל');
                                                    assert.deepEqual(reportNumber2.stages,[]);
                                                    let reportNumber3 = result5[2];
                                                    assert.deepEqual(reportNumber3.attachedFilesNames, []);
                                                    assert.deepEqual(reportNumber3.filledOnlineForms, []);
                                                    assert.deepEqual(reportNumber3.processCreatorEmail, 'negativemanager@outlook.co.il');
                                                    assert.deepEqual(reportNumber3.processName, 'New Process Name 3');
                                                    assert.deepEqual(reportNumber3.processUrgency, 3);
                                                    assert.deepEqual(reportNumber3.status, 'פעיל');
                                                    assert.deepEqual(reportNumber3.stages,[]);
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
    describe('1.5 getAllActiveProcessDetails', function () {
        it('1.5.1 Active processes of specific process.', function (done) {
            activeProcessController.getActiveProcessByProcessName('אין תהליך כזה', (err, activeProcesses1) => {
                if (err) {
                    done(err);
                }
                else {
                    assert.deepEqual(activeProcesses1, null);
                    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לכבוד סיום התואר הראשון 1', new Date(2018, 11, 24, 10, 33, 30, 0), 1, (err1, result1) => {
                        if (err1) {
                            done(err1);
                        }
                        else {
                            activeProcessController.getActiveProcessByProcessName('גרפיקה לכבוד סיום התואר הראשון 1', (err2, activeProcesses2) => {
                                    if (err2) {
                                        done(err2);
                                    }
                                    else {
                                        assert.deepEqual(activeProcesses2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                        assert.deepEqual(activeProcesses2.processName, 'גרפיקה לכבוד סיום התואר הראשון 1');
                                        assert.deepEqual(activeProcesses2.processUrgency, 1);
                                        assert.deepEqual(activeProcesses2.currentStages, [3]);
                                        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לכבוד סיום התואר הראשון 2', new Date(2018, 11, 24, 10, 33, 30, 0), 2, (err3, result3) => {
                                            if (err3) done(err3);
                                            else {
                                                activeProcessController.getActiveProcessByProcessName('גרפיקה לכבוד סיום התואר הראשון 2', (err4, activeProcesses3) => {
                                                    if (err4) {
                                                        done(err4);
                                                    }
                                                    else {
                                                        assert.deepEqual(activeProcesses3.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                        assert.deepEqual(activeProcesses3.processName, 'גרפיקה לכבוד סיום התואר הראשון 2');
                                                        assert.deepEqual(activeProcesses3.processUrgency, 2);
                                                        assert.deepEqual(activeProcesses3.currentStages, [3]);
                                                        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                                            comments: 'הערות של סגן מנהל נגטיב',
                                                            2: 'on',
                                                            processName: 'גרפיקה לכבוד סיום התואר הראשון 1'
                                                        }, [], (err5) => {
                                                            if (err5) {
                                                                done(err5);
                                                            }
                                                            else {
                                                                activeProcessController.getActiveProcessByProcessName('גרפיקה לכבוד סיום התואר הראשון 1', (err6, activeProcesses4) => {
                                                                    if (err6) {
                                                                        done(err6);
                                                                    }
                                                                    else {
                                                                        assert.deepEqual(activeProcesses4.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                        assert.deepEqual(activeProcesses4.processName, 'גרפיקה לכבוד סיום התואר הראשון 1');
                                                                        assert.deepEqual(activeProcesses4.processUrgency, 1);
                                                                        assert.deepEqual(activeProcesses4.currentStages, [2]);
                                                                        activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                                                                            comments: 'הערות של מנהל נגטיב',
                                                                            4: 'on',
                                                                            processName: 'גרפיקה לכבוד סיום התואר הראשון 1'
                                                                        }, [], (err7) => {
                                                                            if (err7) {
                                                                                done(err7);
                                                                            }
                                                                            else {
                                                                                activeProcessController.getActiveProcessByProcessName('גרפיקה לכבוד סיום התואר הראשון 1', (err8, activeProcesses5) => {
                                                                                    if (err8) {
                                                                                        done(err8);
                                                                                    }
                                                                                    else {
                                                                                        assert.deepEqual(activeProcesses5.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                        assert.deepEqual(activeProcesses5.processName, 'גרפיקה לכבוד סיום התואר הראשון 1');
                                                                                        assert.deepEqual(activeProcesses5.processUrgency, 1);
                                                                                        assert.deepEqual(activeProcesses5.currentStages, [4]);
                                                                                        activeProcessController.uploadFilesAndHandleProcess('publicitydepartmenthead@outlook.co.il', {
                                                                                            comments: 'הערות של רמד הסברה',
                                                                                            processName: 'גרפיקה לכבוד סיום התואר הראשון 1'
                                                                                        }, [], (err9) => {
                                                                                            if (err9) {
                                                                                                done(err9);
                                                                                            }
                                                                                            else {
                                                                                                activeProcessController.getActiveProcessByProcessName('גרפיקה לכבוד סיום התואר הראשון 2', (err10, activeProcesses6) => {
                                                                                                    if (err10) {
                                                                                                        done(err10);
                                                                                                    }
                                                                                                    else {
                                                                                                        assert.deepEqual(activeProcesses6.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                                        assert.deepEqual(activeProcesses6.processName, 'גרפיקה לכבוד סיום התואר הראשון 2');
                                                                                                        assert.deepEqual(activeProcesses6.processUrgency, 2);
                                                                                                        assert.deepEqual(activeProcesses6.currentStages, [3]);
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
    describe('1.6 replaceRoleIDWithRoleNameAndUserEmailWithUserName', function () {
        it('1.6.1 Active processes of specific users.', function (done) {
            userAccessor.findRoleIDByRoleName('דובר', (err1, roleID1) => {
                if (err1) {
                    done(err1);
                }
                else {
                    userAccessor.findRoleIDByRoleName('מנהל נגטיב', (err2, roleID2) => {
                        if (err2) {
                            done(err2);
                        }
                        else {
                            let processStages = [];
                            let activeProcessStage1 = new activeProcessStage({
                                roleID: roleID1[0].id, kind: undefined, dereg: undefined,
                                stageNum: undefined, nextStages: undefined,
                                stagesToWaitFor: undefined,
                                originStagesToWaitFor: undefined,
                                userEmail: 'spokesperson@outlook.co.il',
                                approvalTime: undefined, assignmentTime: undefined, notificationsCycle: undefined
                            });
                            let activeProcessStage2 = new activeProcessStage({
                                roleID: roleID2[0].id, kind: undefined, dereg: undefined,
                                stageNum: undefined, nextStages: undefined,
                                stagesToWaitFor: undefined,
                                originStagesToWaitFor: undefined,
                                userEmail: 'negativemanager@outlook.co.il',
                                approvalTime: undefined, assignmentTime: undefined, notificationsCycle: undefined
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
                                    let firstStage = activeProcesses[0].stages[0];
                                    assert.deepEqual(firstStage.roleName, 'דובר');
                                    assert.deepEqual(firstStage.userName, 'דובר1');
                                    let secondStage = activeProcesses[0].stages[1];
                                    assert.deepEqual(secondStage.roleName, 'מנהל נגטיב');
                                    assert.deepEqual(secondStage.userName, 'מנהל נגטיב');
                                    done();
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    });
    describe('1.7 convertDate', function () {
        it('1.7.1 Change the date conversion.', function (done) {
            let activeProcess1 = new activeProcess({
                processName: 'ערב פוקר שבועי 1',
                creatorUserEmail: undefined,
                processDate: undefined,
                processUrgency: undefined,
                creationTime: new Date(2017, 10, 20, 10, 30, 30, 0),
                notificationTime: undefined,
                automaticAdvanceTime: undefined,
                currentStages: undefined,
                onlineForms: undefined,
                filledOnlineForms: undefined,
                lastApproached: new Date(2017, 10, 20, 10, 30, 30, 0),
                stageToReturnTo: [1]
            }, []);
            let activeProcess2 = new activeProcess({
                processName: 'ערב פוקר שבועי 2',
                creatorUserEmail: undefined,
                processDate: undefined,
                processUrgency: undefined,
                creationTime: new Date(2018, 11, 21, 11, 40, 30, 0),
                notificationTime: undefined,
                automaticAdvanceTime: undefined,
                currentStages: undefined,
                onlineForms: undefined,
                filledOnlineForms: undefined,
                lastApproached: new Date(2018, 11, 21, 11, 40, 30, 0),
                stageToReturnTo: undefined
            }, []);
            let activeProcess3 = new activeProcess({
                processName: 'ערב פוקר שבועי 3',
                creatorUserEmail: undefined,
                processDate: undefined,
                processUrgency: undefined,
                creationTime: new Date(2019, 12, 22, 12, 50, 30, 0),
                notificationTime: undefined,
                automaticAdvanceTime: undefined,
                currentStages: undefined,
                onlineForms: undefined,
                filledOnlineForms: undefined,
                lastApproached: new Date(2019, 12, 22, 12, 50, 30, 0),
                stageToReturnTo: undefined
            }, []);
            let array = [activeProcess1, activeProcess2, activeProcess3];
            activeProcessController.convertDate(array);
            assert.deepEqual(array.length, 3);
            assert.deepEqual(array[0].creationTime, '20/11/2017 10:30:30');
            assert.deepEqual(array[0].lastApproached, '20/11/2017 10:30:30');
            assert.deepEqual(array[1].creationTime, '21/12/2018 11:40:30');
            assert.deepEqual(array[1].lastApproached, '21/12/2018 11:40:30');
            assert.deepEqual(array[2].creationTime, '22/01/2020 12:50:30');
            assert.deepEqual(array[2].lastApproached, '22/01/2020 12:50:30');
            done();
        });
    }).timeout(30000);
    describe('1.8 isExistInReport', function () {
        it('1.7.1 Change the date conversion.', function (done) {
            let activeProcess1 = new activeProcess({
                processName: 'ערב פוקר שבועי 1',
                creatorUserEmail: undefined,
                processDate: undefined,
                processUrgency: undefined,
                creationTime: new Date(2017, 10, 20, 10, 30, 30, 0),
                notificationTime: undefined,
                automaticAdvanceTime: undefined,
                currentStages: undefined,
                onlineForms: undefined,
                filledOnlineForms: undefined,
                lastApproached: new Date(2017, 10, 20, 10, 30, 30, 0),
                stageToReturnTo: [1]
            }, []);
            let activeProcess2 = new activeProcess({
                processName: 'ערב פוקר שבועי 2',
                creatorUserEmail: undefined,
                processDate: undefined,
                processUrgency: undefined,
                creationTime: new Date(2018, 11, 21, 11, 40, 30, 0),
                notificationTime: undefined,
                automaticAdvanceTime: undefined,
                currentStages: undefined,
                onlineForms: undefined,
                filledOnlineForms: undefined,
                lastApproached: new Date(2018, 11, 21, 11, 40, 30, 0),
                stageToReturnTo: undefined
            }, []);
            let activeProcess3 = new activeProcess({
                processName: 'ערב פוקר שבועי 3',
                creatorUserEmail: undefined,
                processDate: undefined,
                processUrgency: undefined,
                creationTime: new Date(2019, 12, 22, 12, 50, 30, 0),
                notificationTime: undefined,
                automaticAdvanceTime: undefined,
                currentStages: undefined,
                onlineForms: undefined,
                filledOnlineForms: undefined,
                lastApproached: new Date(2019, 12, 22, 12, 50, 30, 0),
                stageToReturnTo: undefined
            }, []);
            let array = [activeProcess1, activeProcess2, activeProcess3];
            activeProcessController.convertDate(array);
            assert.deepEqual(array.length, 3);
            assert.deepEqual(array[0].creationTime, '20/11/2017 10:30:30');
            assert.deepEqual(array[0].lastApproached, '20/11/2017 10:30:30');
            assert.deepEqual(array[1].creationTime, '21/12/2018 11:40:30');
            assert.deepEqual(array[1].lastApproached, '21/12/2018 11:40:30');
            assert.deepEqual(array[2].creationTime, '22/01/2020 12:50:30');
            assert.deepEqual(array[2].lastApproached, '22/01/2020 12:50:30');
            done();
        });
    }).timeout(30000);
    describe('1.9 convertDate', function () {
        it('1.7.1 Change the date conversion.', function (done) {
            let activeProcess1 = new activeProcess({
                processName: 'ערב פוקר שבועי 1',
                creatorUserEmail: undefined,
                processDate: undefined,
                processUrgency: undefined,
                creationTime: new Date(2017, 10, 20, 10, 30, 30, 0),
                notificationTime: undefined,
                automaticAdvanceTime: undefined,
                currentStages: undefined,
                onlineForms: undefined,
                filledOnlineForms: undefined,
                lastApproached: new Date(2017, 10, 20, 10, 30, 30, 0),
                stageToReturnTo: [1]
            }, []);
            let activeProcess2 = new activeProcess({
                processName: 'ערב פוקר שבועי 2',
                creatorUserEmail: undefined,
                processDate: undefined,
                processUrgency: undefined,
                creationTime: new Date(2018, 11, 21, 11, 40, 30, 0),
                notificationTime: undefined,
                automaticAdvanceTime: undefined,
                currentStages: undefined,
                onlineForms: undefined,
                filledOnlineForms: undefined,
                lastApproached: new Date(2018, 11, 21, 11, 40, 30, 0),
                stageToReturnTo: undefined
            }, []);
            let activeProcess3 = new activeProcess({
                processName: 'ערב פוקר שבועי 3',
                creatorUserEmail: undefined,
                processDate: undefined,
                processUrgency: undefined,
                creationTime: new Date(2019, 12, 22, 12, 50, 30, 0),
                notificationTime: undefined,
                automaticAdvanceTime: undefined,
                currentStages: undefined,
                onlineForms: undefined,
                filledOnlineForms: undefined,
                lastApproached: new Date(2019, 12, 22, 12, 50, 30, 0),
                stageToReturnTo: undefined
            }, []);
            let array = [activeProcess1, activeProcess2, activeProcess3];
            activeProcessController.convertDate(array);
            assert.deepEqual(array.length, 3);
            assert.deepEqual(array[0].creationTime, '20/11/2017 10:30:30');
            assert.deepEqual(array[0].lastApproached, '20/11/2017 10:30:30');
            assert.deepEqual(array[1].creationTime, '21/12/2018 11:40:30');
            assert.deepEqual(array[1].lastApproached, '21/12/2018 11:40:30');
            assert.deepEqual(array[2].creationTime, '22/01/2020 12:50:30');
            assert.deepEqual(array[2].lastApproached, '22/01/2020 12:50:30');
            done();
        });
    }).timeout(30000);

});