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
let modelUsersAndRoles = require('../../models/schemas/usersSchemas/UsersAndRolesSchema');
let usersAndRolesTreeSankey = require('../../models/schemas/usersSchemas/UsersAndRolesTreeSankeySchema');
let userAccessor = require('../../models/accessors/usersAccessor');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let processStructureSankeyJSON = require('../inputs/processStructures/GraphicsProcessStructure/graphicsSankey');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let usersAndRolesContoller = require('../../controllers/usersControllers/usersAndRolesController');


let globalBefore = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
};

let globalBeforeEach = function (done) {

    //modelUsersAndRoles.createIndexes();
    //usersAndRolesTreeSankey.createIndexes();
};

let globalAfter = function () {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
};

let globalAfterEach = function () {
    mongoose.connection.db.dropDatabase();
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

    it('1.2 create process structure', function (done) {
        processStructureController.addProcessStructure('chairman@outlook.co.il', 'תהליך גרפיקה', JSON.stringify(processStructureSankeyJSON), [], 0, (err, needApproval) => {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
    }).timeout(30000);

    /*it('1.3 start process with wrong process structure name', function (done) {
        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il','תהליך גרפיקה1','גרפיקה ליום הסטודנט', new Date(2018, 11, 24, 10, 33, 30, 0), 3, 24, (err, result)=>{
            if(err) done(err);
            else
            {
                done();
            }
        });
    }).timeout(30000);*/

    it('1.3 start process', function (done) {
        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, 24, (err, result) => {
            if (err) done(err);
            else {
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(true, process !== null);
                        activeProcessController.processReport('גרפיקה להקרנת בכורה',(err, report)=>{
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

    it('1.4 start process with same name', function (done) {
        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, 24, (err, result) => {
            assert.deepEqual(true, err !== null);
            done();
        });
    }).timeout(30000);

    it('1.5 handle process', function (done) {
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
                        let doneStage = process.getStageByStageNum(0);
                        assert.deepEqual(doneStage.comments, 'הערות של סגן מנהל נגטיב');
                        let currentStage = process.getStageByStageNum(1);
                        assert.deepEqual(currentStage.userEmail, 'negativemanager@outlook.co.il');
                        activeProcessController.processReport('גרפיקה להקרנת בכורה', (err, report)=>{
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

    it('1.6 handle process with user not in current stages', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
            comments: 'הערות למנהל נגטיב',
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
                        let doneStage = process.getStageByStageNum(process.getCurrentStageNumberForUser('negativevicemanager@outlook.co.il'));
                        assert.deepEqual(doneStage.comments, 'הערות למנהל נגטיב');
                        done();
                    }
                });
            }
        });
    }).timeout(30000);
});