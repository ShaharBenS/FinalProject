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


let globalBefore = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
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
    it('1.1 create users tree', function (done) {
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
                            done();
                        }
                    });
            }
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
        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il','תהליך גרפיקה','גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, 24, (err, result)=>{
            if(err) done(err);
            else
            {
                done();
            }
        });
    }).timeout(30000);

    it('1.4 start process with same name', function (done) {
        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il','תהליך גרפיקה','גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, 24, (err, result)=>{
            assert.deepEqual(true, err !== null);
            done();
        });
    }).timeout(30000);

    it('1.4 handle process', function (done) {
        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il',{comments: '', 1: 'on', processName: 'גרפיקה להקרנת בכורה'},[], (err, result)=>{
            if(err) done(err);
            else
            {
                done();
            }
        });
    }).timeout(30000);
});