let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let UsersAndRolesTreeSankey = require('../../controllers/usersControllers/usersAndRolesController');
let sankeyContent = require('../inputs/trees/GraphicsTree/sankeyTree');
let emailsToFullName = require('../inputs/trees/GraphicsTree/emailsToFullName');
let rolesToDereg = require('../inputs/trees/GraphicsTree/rolesToDereg');
let rolesToEmails = require('../inputs/trees/GraphicsTree/rolesToEmails');
let userAccessor = require('../../models/accessors/usersAccessor');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let processStructureSankeyJSON = require('../inputs/processStructures/GraphicsProcessStructure/graphicsSankey');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let processReportController = require('../../controllers/processesControllers/processReportController');
let usersAndRolesContoller = require('../../controllers/usersControllers/usersAndRolesController');


let globalBefore = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
};

let globalAfter = function () {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
};


describe('1. graphics test', function () {
    before(globalBefore);
    after(globalAfter);
    it('1.1 check users names', function (done) {
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
                            usersAndRolesContoller.getEmailToFullName((err, emailToFullNameFromDB) => {
                                assert.deepEqual(Object.keys(emailToFullNameFromDB).length, Object.keys(emailsToFullName).length);
                                for (let email in emailToFullNameFromDB) {
                                    if(emailToFullNameFromDB.hasOwnProperty(email))
                                    {
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

    it('1.2 check users roles', function (done) {
        usersAndRolesContoller.getRoleToEmails((err, roleToEmailsFromDB) => {
            assert.deepEqual(Object.keys(roleToEmailsFromDB).length, Object.keys(rolesToEmails).length);
            for (let role in roleToEmailsFromDB) {
                if(roleToEmailsFromDB.hasOwnProperty(role))
                {
                    assert.deepEqual(true, Object.keys(rolesToEmails).includes(role));
                    assert.deepEqual(roleToEmailsFromDB[role].length, rolesToEmails[role].length);
                    for(let i=0;i<roleToEmailsFromDB[role].length;i++)
                    {
                        assert.deepEqual(true, roleToEmailsFromDB[role][i] === rolesToEmails[role][i]);
                    }
                }
            }
            done();
        });
    }).timeout(30000);

    it('1.3 check roles ranks', function (done) {
        usersAndRolesContoller.getRoleToDereg((err, roleToDeregsFromDB) => {
            assert.deepEqual(Object.keys(roleToDeregsFromDB).length, Object.keys(rolesToDereg).length);
            for (let role in roleToDeregsFromDB) {
                if(roleToDeregsFromDB.hasOwnProperty(role))
                {
                    assert.deepEqual(true, Object.keys(rolesToDereg).includes(role));
                    assert.deepEqual(roleToDeregsFromDB[role].length, rolesToDereg[role].length);
                    for(let i=0;i<roleToDeregsFromDB[role].length;i++)
                    {
                        assert.deepEqual(true, roleToDeregsFromDB[role][i] === rolesToDereg[role][i]);
                    }
                }
            }
            done();
        });
    }).timeout(30000);

    it('1.4 create process structure', function (done) {
        processStructureController.addProcessStructure('chairman@outlook.co.il', 'תהליך גרפיקה', JSON.stringify(processStructureSankeyJSON), [], 0, "12", (err, needApproval) => {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
    }).timeout(30000);


    it('1.5 start process', function (done) {
        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(true, process !== null);
                        processReportController.processReport('גרפיקה להקרנת בכורה',(err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 0);
                                assert.deepEqual(report[0].processName, 'גרפיקה להקרנת בכורה');
                                assert.deepEqual(report[0].status, 'פעיל');
                                assert.deepEqual(report[0].urgency, 3);
                                //assert.deepEqual(report[0].processCreatorEmail, 'negativevicemanager@outlook.co.il');
                                assert.deepEqual(report[0].filledOnlineForms, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.6 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
            comments: 'הערות של סגן מנהל נגטיב',
            1: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [1]);
                        let currentStage = process.getStageByStageNum(1);
                        assert.deepEqual(currentStage.userEmail, 'negativemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 1);
                                assert.deepEqual(report[1][0].userEmail, 'negativevicemanager@outlook.co.il');
                                assert.deepEqual(report[1][0].userName, 'קרלוס קאסמירו');
                                assert.deepEqual(report[1][0].roleName, 'סגן מנהל נגטיב');
                                assert.deepEqual(report[1][0].comments, 'הערות של סגן מנהל נגטיב');
                                assert.deepEqual(report[1][0].action, 'continue');
                                assert.deepEqual(report[1][0].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.7 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
            comments: 'הערות של מנהל נגטיב',
            6: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [6]);
                        let currentStage = process.getStageByStageNum(6);
                        assert.deepEqual(currentStage.userEmail, 'campaignbrandingsupervisor@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 2);
                                assert.deepEqual(report[1][1].userEmail, 'negativemanager@outlook.co.il');
                                assert.deepEqual(report[1][1].userName, 'גארת בייל');
                                assert.deepEqual(report[1][1].roleName, 'מנהל נגטיב');
                                assert.deepEqual(report[1][1].comments, 'הערות של מנהל נגטיב');
                                assert.deepEqual(report[1][1].action, 'continue');
                                assert.deepEqual(report[1][1].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.8 return process to creator', function (done) {
        activeProcessController.returnToCreator('campaignbrandingsupervisor@outlook.co.il','גרפיקה להקרנת בכורה','הערות חזרה של אחראי מיתוג קמפינים', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [0]);
                        let currentStage = process.getStageByStageNum(0);
                        assert.deepEqual(currentStage.userEmail, 'negativevicemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 3);
                                assert.deepEqual(report[1][2].userEmail, 'campaignbrandingsupervisor@outlook.co.il');
                                assert.deepEqual(report[1][2].userName, 'לוקה מודריץ');
                                assert.deepEqual(report[1][2].roleName, 'אחראי מיתוג קמפיינים');
                                assert.deepEqual(report[1][2].comments, 'הערות חזרה של אחראי מיתוג קמפינים');
                                assert.deepEqual(report[1][2].action, 'return');
                                assert.deepEqual(report[1][2].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.9 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
            comments: 'הערות של סגן מנהל נגטיב',
            1: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [1]);
                        let currentStage = process.getStageByStageNum(1);
                        assert.deepEqual(currentStage.userEmail, 'negativemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 4);
                                assert.deepEqual(report[1][3].userEmail, 'negativevicemanager@outlook.co.il');
                                assert.deepEqual(report[1][3].userName, 'קרלוס קאסמירו');
                                assert.deepEqual(report[1][3].roleName, 'סגן מנהל נגטיב');
                                assert.deepEqual(report[1][3].comments, 'הערות של סגן מנהל נגטיב');
                                assert.deepEqual(report[1][3].action, 'continue');
                                assert.deepEqual(report[1][3].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.10 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
            comments: 'הערות של מנהל נגטיב',
            6: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [6]);
                        let currentStage = process.getStageByStageNum(6);
                        assert.deepEqual(currentStage.userEmail, 'campaignbrandingsupervisor@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 5);
                                assert.deepEqual(report[1][4].userEmail, 'negativemanager@outlook.co.il');
                                assert.deepEqual(report[1][4].userName, 'גארת בייל');
                                assert.deepEqual(report[1][4].roleName, 'מנהל נגטיב');
                                assert.deepEqual(report[1][4].comments, 'הערות של מנהל נגטיב');
                                assert.deepEqual(report[1][4].action, 'continue');
                                assert.deepEqual(report[1][4].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.11 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('campaignbrandingsupervisor@outlook.co.il', {
            comments: 'הערות של אחראי מיתוג קמפיינים',
            7: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [7]);
                        let currentStage = process.getStageByStageNum(7);
                        assert.deepEqual(currentStage.userEmail, 'spokesperson@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 6);
                                assert.deepEqual(report[1][5].userEmail, 'campaignbrandingsupervisor@outlook.co.il');
                                assert.deepEqual(report[1][5].userName, 'לוקה מודריץ');
                                assert.deepEqual(report[1][5].roleName, 'אחראי מיתוג קמפיינים');
                                assert.deepEqual(report[1][5].comments, 'הערות של אחראי מיתוג קמפיינים');
                                assert.deepEqual(report[1][5].action, 'continue');
                                assert.deepEqual(report[1][5].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.12 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('spokesperson@outlook.co.il', {
            comments: 'הערות של דובר',
            5: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [5]);
                        let currentStage = process.getStageByStageNum(5);
                        assert.deepEqual(currentStage.userEmail, null);
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 7);
                                assert.deepEqual(report[1][6].userEmail, 'spokesperson@outlook.co.il');
                                assert.deepEqual(report[1][6].userName, 'פדריקו וולוורדה');
                                assert.deepEqual(report[1][6].roleName, 'דובר');
                                assert.deepEqual(report[1][6].comments, 'הערות של דובר');
                                assert.deepEqual(report[1][6].action, 'continue');
                                assert.deepEqual(report[1][6].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.13 take part in process', function (done) {
        activeProcessController.takePartInActiveProcess('גרפיקה להקרנת בכורה', 'graphicartist@outlook.co.il', (err)=>{
            if(err) done(err);
            else
            {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [5]);
                        let currentStage = process.getStageByStageNum(5);
                        assert.deepEqual(currentStage.userEmail, 'graphicartist@outlook.co.il');
                        done();
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.14 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('graphicartist@outlook.co.il', {
            comments: 'הערות של גרפיקאי',
            3: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [3]);
                        let currentStage = process.getStageByStageNum(3);
                        assert.deepEqual(currentStage.userEmail, 'campaignbrandingsupervisor@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 8);
                                assert.deepEqual(report[1][7].userEmail, 'graphicartist@outlook.co.il');
                                assert.deepEqual(report[1][7].userName, 'ברהים דיאז');
                                assert.deepEqual(report[1][7].roleName, 'גרפיקאי');
                                assert.deepEqual(report[1][7].comments, 'הערות של גרפיקאי');
                                assert.deepEqual(report[1][7].action, 'continue');
                                assert.deepEqual(report[1][7].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.15 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('campaignbrandingsupervisor@outlook.co.il', {
            comments: 'הערות של אחראי מיתוג קמפיינים',
            4: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [4]);
                        let currentStage = process.getStageByStageNum(4);
                        assert.deepEqual(currentStage.userEmail, 'spokesperson@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 9);
                                assert.deepEqual(report[1][8].userEmail, 'campaignbrandingsupervisor@outlook.co.il');
                                assert.deepEqual(report[1][8].userName, 'לוקה מודריץ');
                                assert.deepEqual(report[1][8].roleName, 'אחראי מיתוג קמפיינים');
                                assert.deepEqual(report[1][8].comments, 'הערות של אחראי מיתוג קמפיינים');
                                assert.deepEqual(report[1][8].action, 'continue');
                                assert.deepEqual(report[1][8].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.16 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('spokesperson@outlook.co.il', {
            comments: 'הערות של דובר',
            8: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [8]);
                        let currentStage = process.getStageByStageNum(8);
                        assert.deepEqual(currentStage.userEmail, 'publicitydepartmenthead@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 10);
                                assert.deepEqual(report[1][9].userEmail, 'spokesperson@outlook.co.il');
                                assert.deepEqual(report[1][9].userName, 'פדריקו וולוורדה');
                                assert.deepEqual(report[1][9].roleName, 'דובר');
                                assert.deepEqual(report[1][9].comments, 'הערות של דובר');
                                assert.deepEqual(report[1][9].action, 'continue');
                                assert.deepEqual(report[1][9].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.17 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('publicitydepartmenthead@outlook.co.il', {
            comments: 'הערות של רמ"ד הסברה',
            9: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [9]);
                        let currentStage = process.getStageByStageNum(9);
                        assert.deepEqual(currentStage.userEmail, 'negativevicemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 11);
                                assert.deepEqual(report[1][10].userEmail, 'publicitydepartmenthead@outlook.co.il');
                                assert.deepEqual(report[1][10].userName, 'סרחיו רגילון');
                                assert.deepEqual(report[1][10].roleName, 'ראש מדור הסברה');
                                assert.deepEqual(report[1][10].comments, 'הערות של רמ"ד הסברה');
                                assert.deepEqual(report[1][10].action, 'continue');
                                assert.deepEqual(report[1][10].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.18 return process to creator', function (done) {
        activeProcessController.returnToCreator('negativevicemanager@outlook.co.il','גרפיקה להקרנת בכורה','הערות חזרה של סגן מנהל נגטיב', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [0]);
                        let currentStage = process.getStageByStageNum(0);
                        assert.deepEqual(currentStage.userEmail, 'negativevicemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 12);
                                assert.deepEqual(report[1][11].userEmail, 'negativevicemanager@outlook.co.il');
                                assert.deepEqual(report[1][11].userName, 'קרלוס קאסמירו');
                                assert.deepEqual(report[1][11].roleName, 'סגן מנהל נגטיב');
                                assert.deepEqual(report[1][11].comments, 'הערות חזרה של סגן מנהל נגטיב');
                                assert.deepEqual(report[1][11].action, 'return');
                                assert.deepEqual(report[1][11].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.19 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
            comments: 'הערות של סגן מנהל נגטיב',
            1: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [1]);
                        let currentStage = process.getStageByStageNum(1);
                        assert.deepEqual(currentStage.userEmail, 'negativemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 13);
                                assert.deepEqual(report[1][12].userEmail, 'negativevicemanager@outlook.co.il');
                                assert.deepEqual(report[1][12].userName, 'קרלוס קאסמירו');
                                assert.deepEqual(report[1][12].roleName, 'סגן מנהל נגטיב');
                                assert.deepEqual(report[1][12].comments, 'הערות של סגן מנהל נגטיב');
                                assert.deepEqual(report[1][12].action, 'continue');
                                assert.deepEqual(report[1][12].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.20 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
            comments: 'הערות של מנהל נגטיב',
            6: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [6]);
                        let currentStage = process.getStageByStageNum(6);
                        assert.deepEqual(currentStage.userEmail, 'campaignbrandingsupervisor@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 14);
                                assert.deepEqual(report[1][13].userEmail, 'negativemanager@outlook.co.il');
                                assert.deepEqual(report[1][13].userName, 'גארת בייל');
                                assert.deepEqual(report[1][13].roleName, 'מנהל נגטיב');
                                assert.deepEqual(report[1][13].comments, 'הערות של מנהל נגטיב');
                                assert.deepEqual(report[1][13].action, 'continue');
                                assert.deepEqual(report[1][13].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.21 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('campaignbrandingsupervisor@outlook.co.il', {
            comments: 'הערות של אחראי מיתוג קמפיינים',
            7: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [7]);
                        let currentStage = process.getStageByStageNum(7);
                        assert.deepEqual(currentStage.userEmail, 'spokesperson@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 15);
                                assert.deepEqual(report[1][14].userEmail, 'campaignbrandingsupervisor@outlook.co.il');
                                assert.deepEqual(report[1][14].userName, 'לוקה מודריץ');
                                assert.deepEqual(report[1][14].roleName, 'אחראי מיתוג קמפיינים');
                                assert.deepEqual(report[1][14].comments, 'הערות של אחראי מיתוג קמפיינים');
                                assert.deepEqual(report[1][14].action, 'continue');
                                assert.deepEqual(report[1][14].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.22 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('spokesperson@outlook.co.il', {
            comments: 'הערות של דובר',
            5: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [5]);
                        let currentStage = process.getStageByStageNum(5);
                        assert.deepEqual(currentStage.userEmail, 'graphicartist@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 16);
                                assert.deepEqual(report[1][15].userEmail, 'spokesperson@outlook.co.il');
                                assert.deepEqual(report[1][15].userName, 'פדריקו וולוורדה');
                                assert.deepEqual(report[1][15].roleName, 'דובר');
                                assert.deepEqual(report[1][15].comments, 'הערות של דובר');
                                assert.deepEqual(report[1][15].action, 'continue');
                                assert.deepEqual(report[1][15].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.23 untake part in process', function (done) {
        activeProcessController.unTakePartInActiveProcess('גרפיקה להקרנת בכורה', 'graphicartist@outlook.co.il', (err)=>{
            if(err) done(err);
            else
            {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [5]);
                        let currentStage = process.getStageByStageNum(5);
                        assert.deepEqual(currentStage.userEmail, null);
                        done();
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.24 take part in process', function (done) {
        activeProcessController.takePartInActiveProcess('גרפיקה להקרנת בכורה', 'graphicartist2@outlook.co.il', (err)=>{
            if(err) done(err);
            else
            {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [5]);
                        let currentStage = process.getStageByStageNum(5);
                        assert.deepEqual(currentStage.userEmail, 'graphicartist2@outlook.co.il');
                        done();
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.25 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('graphicartist2@outlook.co.il', {
            comments: 'הערות של גרפיקאי',
            3: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [3]);
                        let currentStage = process.getStageByStageNum(3);
                        assert.deepEqual(currentStage.userEmail, 'campaignbrandingsupervisor@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 17);
                                assert.deepEqual(report[1][16].userEmail, 'graphicartist2@outlook.co.il');
                                assert.deepEqual(report[1][16].userName, 'בורחה מיוראל');
                                assert.deepEqual(report[1][16].roleName, 'גרפיקאי');
                                assert.deepEqual(report[1][16].comments, 'הערות של גרפיקאי');
                                assert.deepEqual(report[1][16].action, 'continue');
                                assert.deepEqual(report[1][16].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.26 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('campaignbrandingsupervisor@outlook.co.il', {
            comments: 'הערות של אחראי מיתוג קמפיינים',
            4: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [4]);
                        let currentStage = process.getStageByStageNum(4);
                        assert.deepEqual(currentStage.userEmail, 'spokesperson@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 18);
                                assert.deepEqual(report[1][17].userEmail, 'campaignbrandingsupervisor@outlook.co.il');
                                assert.deepEqual(report[1][17].userName, 'לוקה מודריץ');
                                assert.deepEqual(report[1][17].roleName, 'אחראי מיתוג קמפיינים');
                                assert.deepEqual(report[1][17].comments, 'הערות של אחראי מיתוג קמפיינים');
                                assert.deepEqual(report[1][17].action, 'continue');
                                assert.deepEqual(report[1][17].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.27 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('spokesperson@outlook.co.il', {
            comments: 'הערות של דובר',
            8: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [8]);
                        let currentStage = process.getStageByStageNum(8);
                        assert.deepEqual(currentStage.userEmail, 'publicitydepartmenthead@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 19);
                                assert.deepEqual(report[1][18].userEmail, 'spokesperson@outlook.co.il');
                                assert.deepEqual(report[1][18].userName, 'פדריקו וולוורדה');
                                assert.deepEqual(report[1][18].roleName, 'דובר');
                                assert.deepEqual(report[1][18].comments, 'הערות של דובר');
                                assert.deepEqual(report[1][18].action, 'continue');
                                assert.deepEqual(report[1][18].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.28 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('publicitydepartmenthead@outlook.co.il', {
            comments: 'הערות של רמ"ד הסברה',
            9: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [9]);
                        let currentStage = process.getStageByStageNum(9);
                        assert.deepEqual(currentStage.userEmail, 'negativevicemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 20);
                                assert.deepEqual(report[1][19].userEmail, 'publicitydepartmenthead@outlook.co.il');
                                assert.deepEqual(report[1][19].userName, 'סרחיו רגילון');
                                assert.deepEqual(report[1][19].roleName, 'ראש מדור הסברה');
                                assert.deepEqual(report[1][19].comments, 'הערות של רמ"ד הסברה');
                                assert.deepEqual(report[1][19].action, 'continue');
                                assert.deepEqual(report[1][19].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.29 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
            comments: 'הערות של סגן מנהל נגטיב',
            10: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [10]);
                        let currentStage = process.getStageByStageNum(10);
                        assert.deepEqual(currentStage.userEmail, 'negativemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 21);
                                assert.deepEqual(report[1][20].userEmail, 'negativevicemanager@outlook.co.il');
                                assert.deepEqual(report[1][20].userName, 'קרלוס קאסמירו');
                                assert.deepEqual(report[1][20].roleName, 'סגן מנהל נגטיב');
                                assert.deepEqual(report[1][20].comments, 'הערות של סגן מנהל נגטיב');
                                assert.deepEqual(report[1][20].action, 'continue');
                                assert.deepEqual(report[1][20].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.30 return process to creator', function (done) {
        activeProcessController.returnToCreator('negativemanager@outlook.co.il','גרפיקה להקרנת בכורה','הערות חזרה של מנהל נגטיב', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [9]);
                        let currentStage = process.getStageByStageNum(9);
                        assert.deepEqual(currentStage.userEmail, 'negativevicemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 22);
                                assert.deepEqual(report[1][21].userEmail, 'negativemanager@outlook.co.il');
                                assert.deepEqual(report[1][21].userName, 'גארת בייל');
                                assert.deepEqual(report[1][21].roleName, 'מנהל נגטיב');
                                assert.deepEqual(report[1][21].comments, 'הערות חזרה של מנהל נגטיב');
                                assert.deepEqual(report[1][21].action, 'return');
                                assert.deepEqual(report[1][21].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.31 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
            comments: 'הערות של סגן מנהל נגטיב',
            10: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [10]);
                        let currentStage = process.getStageByStageNum(10);
                        assert.deepEqual(currentStage.userEmail, 'negativemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 23);
                                assert.deepEqual(report[1][22].userEmail, 'negativevicemanager@outlook.co.il');
                                assert.deepEqual(report[1][22].userName, 'קרלוס קאסמירו');
                                assert.deepEqual(report[1][22].roleName, 'סגן מנהל נגטיב');
                                assert.deepEqual(report[1][22].comments, 'הערות של סגן מנהל נגטיב');
                                assert.deepEqual(report[1][22].action, 'continue');
                                assert.deepEqual(report[1][22].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.32 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
            comments: 'הערות של מנהל נגטיב',
            13: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [13]);
                        let currentStage = process.getStageByStageNum(13);
                        assert.deepEqual(currentStage.userEmail, 'hangman@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 24);
                                assert.deepEqual(report[1][23].userEmail, 'negativemanager@outlook.co.il');
                                assert.deepEqual(report[1][23].userName, 'גארת בייל');
                                assert.deepEqual(report[1][23].roleName, 'מנהל נגטיב');
                                assert.deepEqual(report[1][23].comments, 'הערות של מנהל נגטיב');
                                assert.deepEqual(report[1][23].action, 'continue');
                                assert.deepEqual(report[1][23].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.33 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('hangman@outlook.co.il', {
            comments: 'הערות של תליין',
            14: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [14]);
                        let currentStage = process.getStageByStageNum(14);
                        assert.deepEqual(currentStage.userEmail, 'negativevicemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 25);
                                assert.deepEqual(report[1][24].userEmail, 'hangman@outlook.co.il');
                                assert.deepEqual(report[1][24].userName, 'רפאל וראן');
                                assert.deepEqual(report[1][24].roleName, 'תליין');
                                assert.deepEqual(report[1][24].comments, 'הערות של תליין');
                                assert.deepEqual(report[1][24].action, 'continue');
                                assert.deepEqual(report[1][24].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.34 return process to creator', function (done) {
        activeProcessController.returnToCreator('negativevicemanager@outlook.co.il','גרפיקה להקרנת בכורה','הערות חזרה של סגן מנהל נגטיב', (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [9]);
                        let currentStage = process.getStageByStageNum(9);
                        assert.deepEqual(currentStage.userEmail, 'negativevicemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 26);
                                assert.deepEqual(report[1][25].userEmail, 'negativevicemanager@outlook.co.il');
                                assert.deepEqual(report[1][25].userName, 'קרלוס קאסמירו');
                                assert.deepEqual(report[1][25].roleName, 'סגן מנהל נגטיב');
                                assert.deepEqual(report[1][25].comments, 'הערות חזרה של סגן מנהל נגטיב');
                                assert.deepEqual(report[1][25].action, 'return');
                                assert.deepEqual(report[1][25].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.35 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
            comments: 'הערות של סגן מנהל נגטיב',
            10: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [10]);
                        let currentStage = process.getStageByStageNum(10);
                        assert.deepEqual(currentStage.userEmail, 'negativemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 27);
                                assert.deepEqual(report[1][26].userEmail, 'negativevicemanager@outlook.co.il');
                                assert.deepEqual(report[1][26].userName, 'קרלוס קאסמירו');
                                assert.deepEqual(report[1][26].roleName, 'סגן מנהל נגטיב');
                                assert.deepEqual(report[1][26].comments, 'הערות של סגן מנהל נגטיב');
                                assert.deepEqual(report[1][26].action, 'continue');
                                assert.deepEqual(report[1][26].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.36 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
            comments: 'הערות של מנהל נגטיב',
            12: 'on',
            13: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages.sort(), [12, 13]);
                        let currentStage1 = process.getStageByStageNum(12);
                        assert.deepEqual(currentStage1.userEmail, 'newmediasupervisor@outlook.co.il');
                        let currentStage2 = process.getStageByStageNum(13);
                        assert.deepEqual(currentStage2.userEmail, 'hangman@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 28);
                                assert.deepEqual(report[1][27].userEmail, 'negativemanager@outlook.co.il');
                                assert.deepEqual(report[1][27].userName, 'גארת בייל');
                                assert.deepEqual(report[1][27].roleName, 'מנהל נגטיב');
                                assert.deepEqual(report[1][27].comments, 'הערות של מנהל נגטיב');
                                assert.deepEqual(report[1][27].action, 'continue');
                                assert.deepEqual(report[1][27].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.37 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('hangman@outlook.co.il', {
            comments: 'הערות של תליין',
            14: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [12]);
                        let currentStage = process.getStageByStageNum(12);
                        assert.deepEqual(currentStage.userEmail, 'newmediasupervisor@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 29);
                                assert.deepEqual(report[1][28].userEmail, 'hangman@outlook.co.il');
                                assert.deepEqual(report[1][28].userName, 'רפאל וראן');
                                assert.deepEqual(report[1][28].roleName, 'תליין');
                                assert.deepEqual(report[1][28].comments, 'הערות של תליין');
                                assert.deepEqual(report[1][28].action, 'continue');
                                assert.deepEqual(report[1][28].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.38 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('newmediasupervisor@outlook.co.il', {
            comments: 'הערות של רכז ניו מדיה',
            14: 'on',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process.currentStages, [14]);
                        let currentStage = process.getStageByStageNum(14);
                        assert.deepEqual(currentStage.userEmail, 'negativevicemanager@outlook.co.il');
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 30);
                                assert.deepEqual(report[1][29].userEmail, 'newmediasupervisor@outlook.co.il');
                                assert.deepEqual(report[1][29].userName, 'טיבו קורטואה');
                                assert.deepEqual(report[1][29].roleName, 'רכז ניו מדיה');
                                assert.deepEqual(report[1][29].comments, 'הערות של רכז ניו מדיה');
                                assert.deepEqual(report[1][29].action, 'continue');
                                assert.deepEqual(report[1][29].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);

    it('1.39 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
            comments: 'הערות של סגן מנהל נגטיב',
            processName: 'גרפיקה להקרנת בכורה'
        }, [], (err) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(process, null);
                        processReportController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
                            if(err) done(err);
                            else
                            {
                                assert.deepEqual(report[1].length, 31);
                                assert.deepEqual(report[1][30].userEmail, 'negativevicemanager@outlook.co.il');
                                assert.deepEqual(report[1][30].userName, 'קרלוס קאסמירו');
                                assert.deepEqual(report[1][30].roleName, 'סגן מנהל נגטיב');
                                assert.deepEqual(report[1][30].comments, 'הערות של סגן מנהל נגטיב');
                                assert.deepEqual(report[1][30].action, 'continue');
                                assert.deepEqual(report[1][30].attachedFilesNames, []);
                                done();
                            }
                        });
                    }
                });
            }
        });
    }).timeout(30000);
});