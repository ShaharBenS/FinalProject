let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let ActiveProcess = require('../../controllers/processes/activeProcessController');
let testHelper = require('./testHelper');
let processHelper = require('../../controllers/processes/helperFunctions');

let globalBefore = async function () {
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.set('useCreateIndex', true);
};

let globalBeforeEach = function (done) {
    testHelper.initRoleTree(
        () => testHelper.initMatchUsersToRoles(done));

};

let globalAfter = function () {
    mongoose.connection.close();
};

let globalAfterEach = function () {
    mongoose.connection.db.dropDatabase();
};


describe('1. start process by username', function () {

    before(globalBefore);
    beforeEach(globalBeforeEach);
    afterEach(globalAfterEach);
    after(globalAfter);

    //  - existing role, matching role to init state, existing structure
    it('1.1 the good case', function (done) {
        ActiveProcess.startProcessByUsername(testHelper.username1, testHelper.processStructureName, testHelper.processName,
            (err) => {
                if (err) done(err);
                else {
                    processHelper.getActiveProcessByProcessName(testHelper.processName,
                        (err, res) => {
                            if (err) done(err);
                            else {
                                assert.notEqual(res, null);
                                assert.equal(res.process_name, testHelper.processName);
                                assert.equal(res.current_stages.length(), 1);
                                assert.isAtLeast(res.stages.length(), 1);
                                assert.equal(res.stages[0].userEmail, testHelper.username1);
                                done();
                            }
                        });
                }
            });
    });

    it('1.2 no structure', function (done) {
        ActiveProcess.startProcessByUsername(testHelper.username1, 'wrong structure name', testHelper.processName,
            (err) => {
                if (err) processHelper.getActiveProcessByProcessName(testHelper.processName,
                    (err) => {
                        if (err) done();
                        else {
                            assert.fail('should return an error');
                            done(err);
                        }
                    });
                else {
                    assert.fail('should return an error');
                    done(err);
                }
            });
    });

    it('1.3 username not match role with init stage', function (done) {
        ActiveProcess.startProcessByUsername(testHelper.username5, testHelper.processStructureName, testHelper.processName,
            (err) => {
                if (err) processHelper.getActiveProcessByProcessName(testHelper.processName,
                    (err) => {
                        if (err) done();
                        else {
                            assert.fail('should return an error');
                            done(err);
                        }
                    });
                else {
                    assert.fail('should return an error');
                    done(err);
                }
            });
    });
});


describe('2. get waiting active processes by user', function () {

    before(globalBefore);
    beforeEach(globalBeforeEach);
    afterEach(globalAfterEach);
    after(globalAfter);

    it('2.1 when there are no active processes', function (done) {
        ActiveProcess.getWaitingActiveProcessesByUser(testHelper.username1,
            (err, res) => {
                if (err) {
                    assert.fail('shouldn\'t return an error');
                    done(err);
                } else {
                    assert.equal(res.length(), 0);
                }
            })
    });

    it('2.2 when there is one active processes', function (done) {
        ActiveProcess.startProcessByUsername(testHelper.username1, testHelper.processStructureName, testHelper.processName,
            (err) => {
                if (err) {
                    assert.fail('shouldn\'t return an error');
                    done(err);
                } else {
                    ActiveProcess.getWaitingActiveProcessesByUser(testHelper.username1,
                        (err, res) => {
                            if (err) {
                                assert.fail('shouldn\'t return an error');
                                done(err);
                            } else {
                                assert.equal(res.length(), 1);
                                ActiveProcess.getWaitingActiveProcessesByUser(testHelper.username21,
                                    (err, res) => {
                                        if (err) {
                                            assert.fail('shouldn\'t return an error');
                                            done(err);
                                        } else {
                                            assert.equal(res.length(), 0);
                                            ActiveProcess.getWaitingActiveProcessesByUser(testHelper.username22,
                                                (err, res) => {
                                                    if (err) {
                                                        assert.fail('shouldn\'t return an error');
                                                        done(err);
                                                    } else {
                                                        assert.equal(res.length(), 0);
                                                        ActiveProcess.getWaitingActiveProcessesByUser(testHelper.username31,
                                                            (err, res) => {
                                                                if (err) {
                                                                    assert.fail('shouldn\'t return an error');
                                                                    done(err);
                                                                } else {
                                                                    assert.equal(res.length(), 0);
                                                                    ActiveProcess.getWaitingActiveProcessesByUser(testHelper.username32,
                                                                        (err, res) => {
                                                                            if (err) {
                                                                                assert.fail('shouldn\'t return an error');
                                                                                done(err);
                                                                            } else {
                                                                                assert.equal(res.length(), 0);
                                                                                done();
                                                                            }
                                                                        })
                                                                }
                                                            })
                                                    }
                                                })
                                        }
                                    })
                            }
                        })
                }
            }
        );
    });
});
