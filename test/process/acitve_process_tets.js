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
        () => testHelper.initMatchUsersToRoles(
            () => testHelper.initSimpleProcessStructure(done)
        ));
};

let beforeEachWithStartProcessAndAssignUser = function (done) {
    globalBeforeEach(
        () => {
            ActiveProcess.startProcessByUsername(testHelper.username1, testHelper.processStructureName, testHelper.processName,
                () => {
                    ActiveProcess.takePartInActiveProcess(testHelper.processName, testHelper.username1, () => done())
                })
        })
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


describe('2. take active process', function () {

    before(globalBefore);
    beforeEach(globalBeforeEach);
    afterEach(globalAfterEach);
    after(globalAfter);

    it('2.1 take by proper user', function (done) {
        ActiveProcess.startProcessByUsername(testHelper.username1, testHelper.processStructureName, testHelper.processName,
            () => {
                ActiveProcess.takePartInActiveProcess(testHelper.processName, testHelper.username1, (err) => {
                    if (err) done(err);
                    else {
                        processHelper.getActiveProcessByProcessName(testHelper.processName, (err, res) => {
                            if (err) done(err);
                            else {
                                assert.equal(res.stages[0].userEmail, testHelper.username1);
                                assert.notEqual(res.stages[1].userEmail, testHelper.username1);
                                done();
                            }
                        })
                    }
                })
            });
    });

    it('2.2 take by improper user', function (done) {
        ActiveProcess.startProcessByUsername(testHelper.username2, testHelper.processStructureName, testHelper.processName,
            () => {
                ActiveProcess.takePartInActiveProcess(testHelper.processName, testHelper.username1, (err) => {
                    if (err) done();
                    else {
                        assert.fail('should return an error');
                        done(err);
                    }
                })
            });
    })
});


describe('3. get waiting active processes by user', function () {

    before(globalBefore);
    beforeEach(beforeEachWithStartProcessAndAssignUser);
    afterEach(globalAfterEach);
    after(globalAfter);

    it('3.1 has one active processes', function (done) {
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
    });

    it('3.2 adds another structure and start it', function (done) {
        testHelper.initAnotherProcessStructure(
            () => {
                ActiveProcess.startProcessByUsername(testHelper.username4, testHelper.processStructureName2, testHelper.processName2,
                    () => {
                        ActiveProcess.takePartInActiveProcess(testHelper.processName2, testHelper.username4, () => {
                            ActiveProcess.getWaitingActiveProcessesByUser(testHelper.username4,
                                (err, res) => {
                                    if (err) done(err);
                                    else {
                                        assert.equal(res.length(), 1);
                                        ActiveProcess.getWaitingActiveProcessesByUser(testHelper.username1,
                                            (err, res) => {
                                                if (err) done(err);
                                                else {
                                                    assert.equal(res.length(), 1);
                                                    done();
                                                }
                                            });
                                    }
                                });
                        });
                    });
            })
    });
});


describe('4. get all active processes by user', function () {

    before(globalBefore);
    beforeEach(beforeEachWithStartProcessAndAssignUser);
    afterEach(globalAfterEach);
    after(globalAfter);


    it('4.1 checks that everyone have 1 process', function (done) {
        ActiveProcess.getAllActiveProcessesByUser(testHelper.username1,
            (err, res) => {
                if (err) {
                    assert.fail('shouldn\'t return an error');
                    done(err);
                } else {
                    assert.equal(res.length(), 1);
                    ActiveProcess.getAllActiveProcessesByUser(testHelper.username21,
                        (err, res) => {
                            if (err) {
                                assert.fail('shouldn\'t return an error');
                                done(err);
                            } else {
                                assert.equal(res.length(), 0);
                                ActiveProcess.getAllActiveProcessesByUser(testHelper.username22,
                                    (err, res) => {
                                        if (err) {
                                            assert.fail('shouldn\'t return an error');
                                            done(err);
                                        } else {
                                            assert.equal(res.length(), 0);
                                            ActiveProcess.getAllActiveProcessesByUser(testHelper.username31,
                                                (err, res) => {
                                                    if (err) {
                                                        assert.fail('shouldn\'t return an error');
                                                        done(err);
                                                    } else {
                                                        assert.equal(res.length(), 0);
                                                        ActiveProcess.getAllActiveProcessesByUser(testHelper.username32,
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
    });


    it('4.2 adds another structure and checks again', function (done) {
        testHelper.initAnotherProcessStructure(
            () => {
                ActiveProcess.startProcessByUsername(testHelper.username4, testHelper.processStructureName2, testHelper.processName2,
                    () => {
                        ActiveProcess.takePartInActiveProcess(testHelper.processName2, testHelper.username4, () => {
                            ActiveProcess.getAllActiveProcessesByUser(testHelper.username4,
                                (err, res) => {
                                    if (err) done(err);
                                    else {
                                        assert.equal(res.length(), 1);
                                        ActiveProcess.getAllActiveProcessesByUser(testHelper.username1,
                                            (err, res) => {
                                                if (err) done(err);
                                                else {
                                                    assert.equal(res.length(), 1);
                                                    ActiveProcess.getAllActiveProcessesByUser(testHelper.username5,
                                                        (err, res) => {
                                                            if (err) done(err);
                                                            else {
                                                                assert.equal(res.length(), 1);
                                                                done();
                                                            }
                                                        });
                                                }
                                            });
                                    }
                                });
                        });
                    });
            });
    });
});


describe('5. handle process', function () {

    before(globalBefore);
    beforeEach(beforeEachWithStartProcessAndAssignUser);
    afterEach(globalAfterEach);
    after(globalAfter);

    it('5.1 good case', function (done) {
        ActiveProcess.handleProcess(testHelper.username1, testHelper.processName, {
                stageNum: 0,
                comments: "abc"
            }, [], [],
            (err) => {
                if (err) done(err);
                else {
                    processHelper.getActiveProcessByProcessName(testHelper.processName, (err, res) => {
                        if (err) done(err);
                        else {
                            assert.equal(res.current_stages.length(), 1);
                            assert.equal(res.current_stages[0], 1);
                            done();
                        }
                    })
                }
            })
    });

    it('5.2 checks if unfit user can advance', function (done) {
        ActiveProcess.handleProcess(testHelper.username21, testHelper.processName, {
                stageNum: 0,
                comments: "abc"
            }, [], [],
            (err) => {
                if (err) done();
                else {
                    assert.fail('shouldn\'t return an error');
                    done(err);
                }
            })
    });

    it('5.3 try to advance wrong process', function (done) {
        ActiveProcess.startProcessByUsername(testHelper.username4, testHelper.processStructureName2, testHelper.processName2,
            () =>
                ActiveProcess.takePartInActiveProcess(testHelper.username4, testHelper.processName2,
                    () =>
                        ActiveProcess.handleProcess(testHelper.username1, testHelper.processName2, {
                                stageNum: 0,
                                comments: "abc"
                            }, [], [],
                            (err) => {
                                if (err) done();
                                else {
                                    assert.fail('shouldn\'t return an error');
                                    done(err);
                                }
                            })))
    });
});


describe('6. untake part in active process', function () {

    before(globalBefore);
    beforeEach(beforeEachWithStartProcessAndAssignUser);
    afterEach(globalAfterEach);
    after(globalAfter);

    it('6.1 good case', function (done) {
        ActiveProcess.unTakePartInActiveProcess(testHelper.processName, testHelper.username1, (err) => {
            if (err) done(err);
            else {
                ActiveProcess.getAllActiveProcessesByUser(testHelper.username1, (err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res.length(), 0);
                        done();
                    }
                })
            }
        })
    });

    it('6.2 untake part by improper user', function (done) {
        ActiveProcess.unTakePartInActiveProcess(testHelper.processName, testHelper.username21, (err) => {
            if (err) done();
            else {
                assert.fail('shouldn\'t return an error');
                done(err);
            }
        })
    });

    it('6.3 untake part from wrong process', function (done) {
        ActiveProcess.startProcessByUsername(testHelper.username4, testHelper.processStructureName2, testHelper.processName2,
            () =>
                ActiveProcess.takePartInActiveProcess(testHelper.username4, testHelper.processName2,
                    () =>
                        ActiveProcess.unTakePartInActiveProcess(testHelper.processName2, testHelper.username1, (err) => {
                            if (err) done();
                            else {
                                assert.fail('shouldn\'t return an error');
                                done(err);
                            }
                        })));
    });

});

