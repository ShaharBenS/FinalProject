let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let UsersAndRolesTreeSankey = require('../../controllers/usersControllers/usersAndRolesController');
let userAccessor = require('../../models/accessors/usersAccessor');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let usersAndRolesContoller = require('../../controllers/usersControllers/usersAndRolesController');
let processReportController = require('../../controllers/processesControllers/processReportController');
//User And Roles Tree Files
let sankeyContent = require('../inputs/trees/tree10/tree10');
let emailsToFullName = require('../inputs/trees/tree10/tree10EmailsToFullNames');
let rolesToDereg = require('../inputs/trees/tree10/tree10RolesToDeregs');
let rolesToEmails = require('../inputs/trees/tree10/tree10RolesToEmails');
//
//Process Structure File
let processStructureSankeyJSON = require('../inputs/processStructures/processStructure10/processStructure10');

let globalBefore = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
};

let globalAfter = function () {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
};

describe('1. Big Integration Test', function () {
    before(globalBefore);
    after(globalAfter);
    it('1.1 Check Usernames.', function (done) {
        userAccessor.createSankeyTree({sankey: JSON.stringify({content: {diagram: []}})}, (err, result) => {
            if (err) {
                done(err);
            }
            else {
                UsersAndRolesTreeSankey.setUsersAndRolesTree('yor@outlook.com', JSON.stringify(sankeyContent),
                    rolesToEmails, emailsToFullName,
                    rolesToDereg, (err) => {
                        if (err) {
                            done(err);
                        }
                        else {
                            usersAndRolesContoller.getEmailToFullName((err, emailToFullNameFromDB) => {
                                assert.deepEqual(Object.keys(emailToFullNameFromDB).length, Object.keys(emailsToFullName).length);
                                for (let email in emailToFullNameFromDB) {
                                    if (emailToFullNameFromDB.hasOwnProperty(email)) {
                                        assert.deepEqual(true, Object.keys(emailsToFullName).includes(email));
                                        assert.deepEqual(true, emailToFullNameFromDB[email] === emailsToFullName[email]);
                                    }
                                }
                                done();
                            });
                        }
                    });
            }
        });
    }).timeout(30000);

    it('1.2 Check Users Roles.', function (done) {
        usersAndRolesContoller.getRoleToEmails((err, roleToEmailsFromDB) => {
            assert.deepEqual(Object.keys(roleToEmailsFromDB).length, Object.keys(rolesToEmails).length);
            for (let role in roleToEmailsFromDB) {
                if (roleToEmailsFromDB.hasOwnProperty(role)) {
                    assert.deepEqual(true, Object.keys(rolesToEmails).includes(role));
                    assert.deepEqual(roleToEmailsFromDB[role].length, rolesToEmails[role].length);
                    for (let i = 0; i < roleToEmailsFromDB[role].length; i++) {
                        assert.deepEqual(true, roleToEmailsFromDB[role][i] === rolesToEmails[role][i]);
                    }
                }
            }
            done();
        });
    }).timeout(30000);

    it('1.3 Check Roles Rank.', function (done) {
        usersAndRolesContoller.getRoleToDereg((err, roleToDeregsFromDB) => {
            assert.deepEqual(Object.keys(roleToDeregsFromDB).length, Object.keys(rolesToDereg).length);
            for (let role in roleToDeregsFromDB) {
                if (roleToDeregsFromDB.hasOwnProperty(role)) {
                    assert.deepEqual(true, Object.keys(rolesToDereg).includes(role));
                    assert.deepEqual(roleToDeregsFromDB[role].length, rolesToDereg[role].length);
                    for (let i = 0; i < roleToDeregsFromDB[role].length; i++) {
                        assert.deepEqual(true, roleToDeregsFromDB[role][i] === rolesToDereg[role][i]);
                    }
                }
            }
            done();
        });
    }).timeout(30000);

    it('1.4 Create Process Structure.', function (done) {
        processStructureController.addProcessStructure('yor@outlook.com', 'תהליך העלאת קמפיין', JSON.stringify(processStructureSankeyJSON), [], 0, "36", (err, needApproval) => {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
    }).timeout(30000);


    it('1.5 Starting The Process.', function (done) {
        activeProcessController.startProcessByUsername('orehMishne@outlook.com', 'תהליך העלאת קמפיין', 'קמפיין בחירות', new Date(), 1, (err, result) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(true, process !== null);
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 0);
                                assert.deepEqual(report[0].processName, 'קמפיין בחירות');
                                assert.deepEqual(report[0].status, 'פעיל');
                                assert.deepEqual(report[0].urgency, 1);
                                assert.deepEqual(report[0].filledOnlineForms, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.6 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('orehMishne@outlook.com', {
            comments: 'הערות של עורך משנה',
            1: 'on',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process.currentStages, [1]);
                        let currentStage = process.getStageByStageNum(1);
                        assert.deepEqual(currentStage.userEmail, 'midaEnglish1@outlook.com');
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 1);
                                assert.deepEqual(report[1][0].userEmail, 'orehMishne@outlook.com');
                                assert.deepEqual(report[1][0].userName, 'ר ר');
                                assert.deepEqual(report[1][0].roleName, 'עורך/ת משנה');
                                assert.deepEqual(report[1][0].comments, 'הערות של עורך משנה');
                                assert.deepEqual(report[1][0].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.7 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('midaEnglish1@outlook.com', {
            comments: 'הערות של מידענ/ית אנגלית',
            2: 'on',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process.currentStages, [2]);
                        let currentStage = process.getStageByStageNum(2);
                        assert.deepEqual(currentStage.userEmail, 'midaArabic@outlook.com');
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 2);
                                assert.deepEqual(report[1][1].userEmail, 'midaEnglish1@outlook.com');
                                assert.deepEqual(report[1][1].userName, 'ת ת');
                                assert.deepEqual(report[1][1].roleName, 'מידענ/ית אנגלית');
                                assert.deepEqual(report[1][1].comments, 'הערות של מידענ/ית אנגלית');
                                assert.deepEqual(report[1][1].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.8 Return Process To Its Creator.', function (done) {
        activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
            if (err) done(err);
            else {
                activeProcessController.returnToCreator('midaArabic@outlook.com', process.processID, 'הערות ותיקונים של מידענ/ית ערבית', (err) => {
                    if (err) done(err);
                    else {
                        activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(process.currentStages, [0]);
                                let currentStage = process.getStageByStageNum(0);
                                assert.deepEqual(currentStage.userEmail, 'orehMishne@outlook.com');
                                processReportController.processReport('קמפיין בחירות', (err, report) => {
                                    if (err) done(err);
                                    else {
                                        assert.deepEqual(report[1].length, 3);
                                        assert.deepEqual(report[1][2].userEmail, 'midaArabic@outlook.com');
                                        assert.deepEqual(report[1][2].userName, 'ש ש');
                                        assert.deepEqual(report[1][2].roleName, 'מידענ/ית ערבית');
                                        assert.deepEqual(report[1][2].comments, 'הערות ותיקונים של מידענ/ית ערבית');
                                        assert.deepEqual(report[1][2].action, 'return');
                                        done();
                                    }
                                });
                            }
                        });
                    }
                });
            }});
    }).timeout(30000);

    it('1.9 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('orehMishne@outlook.com', {
            comments: 'הערות של עורך משנה',
            1: 'on',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process.currentStages, [1]);
                        let currentStage = process.getStageByStageNum(1);
                        assert.deepEqual(currentStage.userEmail, 'midaEnglish1@outlook.com');
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 4);
                                assert.deepEqual(report[1][3].userEmail, 'orehMishne@outlook.com');
                                assert.deepEqual(report[1][3].userName, 'ר ר');
                                assert.deepEqual(report[1][3].roleName, 'עורך/ת משנה');
                                assert.deepEqual(report[1][3].comments, 'הערות של עורך משנה');
                                assert.deepEqual(report[1][3].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.10 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('midaEnglish1@outlook.com', {
            comments: 'הערות של מידענ/ית אנגלית',
            2: 'on',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process.currentStages, [2]);
                        let currentStage = process.getStageByStageNum(2);
                        assert.deepEqual(currentStage.userEmail, 'midaArabic@outlook.com');
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 5);
                                assert.deepEqual(report[1][4].userEmail, 'midaEnglish1@outlook.com');
                                assert.deepEqual(report[1][4].userName, 'ת ת');
                                assert.deepEqual(report[1][4].roleName, 'מידענ/ית אנגלית');
                                assert.deepEqual(report[1][4].comments, 'הערות של מידענ/ית אנגלית');
                                assert.deepEqual(report[1][4].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.11 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('midaArabic@outlook.com', {
            comments: 'הערות של מידענ/ית ערבית',
            3: 'on',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process.currentStages, [3]);
                        let currentStage = process.getStageByStageNum(3);
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 6);
                                assert.deepEqual(report[1][5].userEmail, 'midaArabic@outlook.com');
                                assert.deepEqual(report[1][5].userName, 'ש ש');
                                assert.deepEqual(report[1][5].roleName, 'מידענ/ית ערבית');
                                assert.deepEqual(report[1][5].comments, 'הערות של מידענ/ית ערבית');
                                assert.deepEqual(report[1][5].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.12 Check Available Processes.', function (done) {
        activeProcessController.getAvailableActiveProcessesByUser('MenaelAtar1@outlook.com', (err1, result1) => {
            if (err1) {
                done(err1);
            }
            else {
                activeProcessController.getAvailableActiveProcessesByUser('MenaelAtar2@outlook.com', (err2, result2) => {
                    if (err2) {
                        done(err2);
                    }
                    else {
                        assert.deepEqual(result1.length, 1);
                        let availableProcess1 = result1[0];
                        assert.deepEqual(availableProcess1.creatorUserEmail, 'orehMishne@outlook.com');
                        assert.deepEqual(availableProcess1.notificationTime, 36);
                        assert.deepEqual(availableProcess1.processUrgency, 1);
                        assert.deepEqual(availableProcess1.stageToReturnTo, 0);
                        assert.deepEqual(availableProcess1.onlineForms, []);
                        assert.deepEqual(availableProcess1.filledOnlineForms, []);
                        assert.deepEqual(result2.length, 1);
                        let availableProcess2 = result2[0];
                        assert.deepEqual(availableProcess2.creatorUserEmail, 'orehMishne@outlook.com');
                        assert.deepEqual(availableProcess2.notificationTime, 36);
                        assert.deepEqual(availableProcess2.processUrgency, 1);
                        assert.deepEqual(availableProcess2.stageToReturnTo, 0);
                        assert.deepEqual(availableProcess2.onlineForms, []);
                        assert.deepEqual(availableProcess2.filledOnlineForms, []);
                        done();
                    }
                })
            }
        })
    }).timeout(30000);

    it('1.13 Take Part In Process', function (done) {
        activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
            if (err) done(err);
            else {
                activeProcessController.takePartInActiveProcess('MenaelAtar1@outlook.com', process.processID,  (err) => {
                    if (err) done(err);
                    else {
                        activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(process.currentStages, [3]);
                                let currentStage = process.getStageByStageNum(3);
                                assert.deepEqual(currentStage.userEmail, 'MenaelAtar1@outlook.com');
                                done();
                            }
                        });
                    }
                });
            }});
    }).timeout(30000);

    it('1.14 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('MenaelAtar1@outlook.com', {
            comments: 'הערות של מנהל/ת אתר אינטרנט',
            4: 'on',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process.currentStages, [4]);
                        let currentStage = process.getStageByStageNum(4);
                        assert.deepEqual(currentStage.userEmail, 'ramadHasbara@outlook.com');
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 7);
                                assert.deepEqual(report[1][6].userEmail, 'MenaelAtar1@outlook.com');
                                assert.deepEqual(report[1][6].userName, 'ס ס');
                                assert.deepEqual(report[1][6].roleName, 'מנהל/ת אתר אינטרנט');
                                assert.deepEqual(report[1][6].comments, 'הערות של מנהל/ת אתר אינטרנט');
                                assert.deepEqual(report[1][6].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.15 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('ramadHasbara@outlook.com', {
            comments: 'הערות של רמ"ד הסברה',
            5: 'on',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process.currentStages, [5]);
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 8);
                                assert.deepEqual(report[1][7].userEmail, 'ramadHasbara@outlook.com');
                                assert.deepEqual(report[1][7].userName, 'ו ו');
                                assert.deepEqual(report[1][7].roleName, 'רמ"ד הסברה');
                                assert.deepEqual(report[1][7].comments, 'הערות של רמ"ד הסברה');
                                assert.deepEqual(report[1][7].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.17 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('orehMishne@outlook.com', {
            comments: 'הערות של עורך/ת משנה',
            7: 'on',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process.currentStages, [7]);
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 9);
                                assert.deepEqual(report[1][8].userEmail, 'orehMishne@outlook.com');
                                assert.deepEqual(report[1][8].userName, 'ר ר');
                                assert.deepEqual(report[1][8].roleName, 'עורך/ת משנה');
                                assert.deepEqual(report[1][8].comments, 'הערות של עורך/ת משנה');
                                assert.deepEqual(report[1][8].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);


    it('1.18 Check Available Processes.', function (done) {
        activeProcessController.getAvailableActiveProcessesByUser('MenaelAtar1@outlook.com', (err1, result1) => {
            if (err1) {
                done(err1);
            }
            else {
                activeProcessController.getAvailableActiveProcessesByUser('MenaelAtar2@outlook.com', (err2, result2) => {
                    if (err2) {
                        done(err2);
                    }
                    else {
                        assert.deepEqual(result1.length, 1);
                        let availableProcess1 = result1[0];
                        assert.deepEqual(availableProcess1.creatorUserEmail, 'orehMishne@outlook.com');
                        assert.deepEqual(availableProcess1.notificationTime, 36);
                        assert.deepEqual(availableProcess1.processUrgency, 1);
                        assert.deepEqual(availableProcess1.stageToReturnTo, 5);
                        assert.deepEqual(availableProcess1.onlineForms, []);
                        assert.deepEqual(availableProcess1.filledOnlineForms, []);
                        assert.deepEqual(result2.length, 1);
                        let availableProcess2 = result2[0];
                        assert.deepEqual(availableProcess2.creatorUserEmail, 'orehMishne@outlook.com');
                        assert.deepEqual(availableProcess2.notificationTime, 36);
                        assert.deepEqual(availableProcess2.processUrgency, 1);
                        assert.deepEqual(availableProcess2.stageToReturnTo, 5);
                        assert.deepEqual(availableProcess2.onlineForms, []);
                        assert.deepEqual(availableProcess2.filledOnlineForms, []);
                        done();
                    }
                })
            }
        })
    }).timeout(30000);

    it('1.19 Take Part In Process', function (done) {
        activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
            if (err) done(err);
            else {
                activeProcessController.takePartInActiveProcess('MenaelAtar1@outlook.com', process.processID, (err) => {
                    if (err) done(err);
                    else {
                        activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(process.currentStages, [7]);
                                let currentStage = process.getStageByStageNum(7);
                                assert.deepEqual(currentStage.userEmail, 'MenaelAtar1@outlook.com');
                                done();
                            }
                        });
                    }
                });
            }});
    }).timeout(30000);

    it('1.20 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('MenaelAtar1@outlook.com', {
            comments: 'הערות של מנהל/ת אתר אינטרנט',
            8: 'on',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process.currentStages, [8]);
                        let currentStage = process.getStageByStageNum(8);
                        assert.deepEqual(currentStage.userEmail, 'ramadHasbara@outlook.com');
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 10);
                                assert.deepEqual(report[1][9].userEmail, 'MenaelAtar1@outlook.com');
                                assert.deepEqual(report[1][9].userName, 'ס ס');
                                assert.deepEqual(report[1][9].roleName, 'מנהל/ת אתר אינטרנט');
                                assert.deepEqual(report[1][9].comments, 'הערות של מנהל/ת אתר אינטרנט');
                                assert.deepEqual(report[1][9].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.21 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('ramadHasbara@outlook.com', {
            comments: 'הערות של רמ"ד הסברה',
            9: 'on',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process.currentStages, [9]);
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 11);
                                assert.deepEqual(report[1][10].userEmail, 'ramadHasbara@outlook.com');
                                assert.deepEqual(report[1][10].userName, 'ו ו');
                                assert.deepEqual(report[1][10].roleName, 'רמ"ד הסברה');
                                assert.deepEqual(report[1][10].comments, 'הערות של רמ"ד הסברה');
                                assert.deepEqual(report[1][10].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.22 Handle Process.', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('orehMishne@outlook.com', {
            comments: 'הערות של עורך/ת משנה',
            processName: 'קמפיין בחירות'
        }, [],'files', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('קמפיין בחירות', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(process, null);
                        processReportController.processReport('קמפיין בחירות', (err, report) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(report[1].length, 12);
                                assert.deepEqual(report[1][11].userEmail, 'orehMishne@outlook.com');
                                assert.deepEqual(report[1][11].userName, 'ר ר');
                                assert.deepEqual(report[1][11].roleName, 'עורך/ת משנה');
                                assert.deepEqual(report[1][11].comments, 'הערות של עורך/ת משנה');
                                assert.deepEqual(report[1][11].action, 'continue');
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);
});