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
    mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true}).then(()=>{
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
                        else
                        {
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
    describe('1.1 start process', function (){
        it('1.1.1 start process userEmail not in tree', function (done) {
            activeProcessController.startProcessByUsername('chairman@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                assert.deepEqual(true, err !== null);
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(true, process === null);
                        done();
                    }
                });
            });
        }).timeout(30000);
        it('1.1.2 start process process structure doesn\'t exist', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גלפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                assert.deepEqual(true, err !== null);
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
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
                        if(err) done(err);
                        else
                        {
                            assert.deepEqual(true, process !== null);
                            done();
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.1.4 start process same name', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                assert.deepEqual(true, err !== null);
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if(err) done(err);
                    else
                    {
                        assert.deepEqual(true, process !== null);
                        done();
                    }
                });
            });
        }).timeout(30000);
    });

    describe('1.2 assign single users', function (){
        it('1.2.1 assign single users', function (done) {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il',{comments: 'הערות של סגן מנהל נגטיב', 2: 'on', processName: 'גרפיקה להקרנת בכורה'}, [],(err)=>{
                if(err) done(err);
                else
                {
                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il',{comments: 'הערות של מנהל נגטיב', 0: 'on',1: 'on',4: 'on', processName: 'גרפיקה להקרנת בכורה'}, [],(err)=>{
                        if(err) done(err);
                        else
                        {
                            activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                if(err) done(err);
                                else
                                {
                                    activeProcessController.assignSingleUsersToStages(process, [0,1,4], (err, result) => {
                                        if(err) done(err);
                                        else
                                        {
                                            activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                                if(err) done(err);
                                                else
                                                {
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
                        }});
                }
            });
        }).timeout(30000);
    });
});