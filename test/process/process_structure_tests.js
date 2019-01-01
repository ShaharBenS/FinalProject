let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let processStructure = require("../../schemas/ProcessStructure");
let processStructureControl = require("../../controllers/processes/processStructure");
let UsersAndRoles = require('../../controllers/users/UsersAndRoles');
let HELPER = require("../../controllers/processes/helperFunctions");

describe('7. add process structure', function () {

    before(async function () {
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.set('useCreateIndex', true);
    });

    beforeEach(function (done) {

        UsersAndRoles.addNewRole('r1', '', (err, res) => {
            UsersAndRoles.addNewRole('r2', 'r1', (err, res) => {
                UsersAndRoles.addNewRole('r3', 'r2', (err, res) => {
                    done();
                });
            });
        });

    });

    afterEach(function (done) {
        mongoose.connection.db.dropDatabase();
        done();
    });

    after(function () {
        mongoose.connection.close();
    });

    it('7.1 add process structure', function (done) {
        UsersAndRoles.addNewUserToRole('omri', 'r1', (err4) => {
            UsersAndRoles.addNewUserToRole("kuti", "r2", (err5) => {
                UsersAndRoles.addNewUserToRole("tomer", "r3", (err6) => {
                    let structure_name = 'structure 1';
                    let initials = [1, 2];
                    HELPER.getRoleID_by_username("omri", (err, id1) => {
                        HELPER.getRoleID_by_username("kuti", (err1, id2) => {
                            HELPER.getRoleID_by_username("tomer", (err2, id3) => {
                                let stages = [
                                    {
                                        roleID: id1,
                                        stageNum: 1,
                                        nextStages: [2],
                                        stagesToWaitFor: [],
                                        online_forms: [],
                                        attached_files_names: []
                                    },
                                    {
                                        roleID: id2,
                                        stageNum: 2,
                                        nextStages: [3],
                                        stagesToWaitFor: [1],
                                        online_forms: [],
                                        attached_files_names: []
                                    },
                                    {
                                        roleID: id3,
                                        stageNum: 3,
                                        nextStages: [4],
                                        stagesToWaitFor: [2],
                                        online_forms: [],
                                        attached_files_names: []
                                    },
                                ];
                                processStructure.create({
                                    structure_name: structure_name,
                                    initials: initials,
                                    stages: stages,
                                    sankey: '',
                                }, (err) => {
                                    processStructureControl.getProcessStructure(structure_name, (err, process) => {
                                        assert.equal(process.structure_name, structure_name);
                                        assert.equal(process.initials[0], 1);
                                        assert.equal(process.initials[1], 2);
                                        processStructureControl.getProcessStagesFromOriginal(process.stages, (newS) => {
                                            assert.deepEqual(newS, stages);
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});