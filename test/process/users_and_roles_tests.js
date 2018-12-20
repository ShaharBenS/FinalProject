let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let UsersAndRoles = require('../../controllers/users/UsersAndRoles');


describe('1. add role', function () {

    before(async function () {
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.set('useCreateIndex', true);
    });

    after(function () {
        mongoose.connection.db.dropDatabase();
        mongoose.connection.close();
    });

    it('1.1 add  root role', function (done) {
        let roleName = "role 1";
        UsersAndRoles.addNewRole(roleName, "", (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRoles((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[0].roleName, roleName);
                        done();
                    }
                });
        });
    });

    it('1.2 add role with father', function (done) {
        let roleName = "role 2";
        let fatherRoleName = "role 1";
        UsersAndRoles.addNewRole(roleName, fatherRoleName, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRolesObjects((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[1].roleName, roleName);
                        assert.equal(res[0].children[0], res[1].id);
                        done();
                    }
                });
        });
    });

    it('1.3 shouldn\'t add role with INVALID father', function (done) {
        let roleName = "role 3";
        let fatherRoleName = "INVALID ROLE";
        UsersAndRoles.addNewRole(roleName, fatherRoleName, (err) => {
            if (err) {
                UsersAndRoles.getAllRolesObjects((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res.length, 2);
                        done();
                    }
                });
            } else
                done(new Error("should not happen"))
        });
    });
});

describe('2. delete role', function () {

    before(async function () {
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.set('useCreateIndex', true);
    });

    beforeEach(function (done) {

        UsersAndRoles.addNewRole("role 1", "", (err, res) => {
            UsersAndRoles.addNewRole("role 2", "role 1", (err, res) => {
                UsersAndRoles.addNewRole("role 3", "role 1", (err, res) => {
                    UsersAndRoles.addNewRole("role 4", "role 2", (err, res) => {
                        UsersAndRoles.addNewRole("role 5", "role 4", (err, res) => {
                            done();
                        });
                    });
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

    it('2.1 delete root role', function (done) {
        let roleName = "role 1";
        UsersAndRoles.deleteRole(roleName, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRoles((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res.length, 4);
                        done();
                    }
                });
        });
    });

    it('2.2 delete role that is child of another role', function (done) {
        let roleName = "role 4";
        UsersAndRoles.deleteRole(roleName, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRolesObjects((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[1].children.length, 1);
                        assert.equal(res[1].children[0], res[3].id);
                        done();
                    }
                });
        });
    });

    it('2.3 delete leaf', function (done) {
        let roleName = "role 5";
        UsersAndRoles.deleteRole(roleName, (err) => {
            if (!err) {
                UsersAndRoles.getAllRolesObjects((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[3].children.length, 0);
                        res.every((row) => row.roleName !== roleName);
                        done();
                    }
                });
            } else
                done(err)
        });
    });

    it('2.4 invalid delete', function (done) {
        let roleName = "role 10";
        UsersAndRoles.deleteRole(roleName, (err) => {
            if (err) done();
            else done(new Error("should not happen"));
        });
    });
});


describe.skip('3. add user to role', function () {

    let root = "role 1";
    let son_root = "role 2";
    let role3 = "role 3";
    let role4 = "role 4";
    let role5 = "role 5";
    let username = "random@bgu.aguda.ac.il";
    let username2 = "random2@bgu.aguda.ac.il";


    beforeEach(async function () {
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.set('useCreateIndex', true);
        UsersAndRoles.addNewRole(root, "", () => {
            UsersAndRoles.addNewRole(son_root, root, () => {
                UsersAndRoles.addNewRole(role3, root, () => {
                    UsersAndRoles.addNewRole(role4, son_root, () => {
                        UsersAndRoles.addNewRole(role5, role4, () => {

                        })
                    })
                })
            })
        })
    });

    after(function () {
        mongoose.connection.db.dropDatabase();
        mongoose.connection.close();
    });

    it('3.1 add root user', function (done) {
        UsersAndRoles.addNewUserToRole(username, root, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRoles((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[0].userEmail.length, 1);
                        assert.equal(res[0].userEmail[0], username);
                        done();
                    }
                });
        });
    });

    it('3.2 add user to role and than add again', function (done) {
        UsersAndRoles.addNewUserToRole(username, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.addNewUserToRole(username, (err) => {
                    if (err) done(err);
                    else
                        UsersAndRoles.getAllRolesObjects((err, res) => {
                            if (err) done(err);
                            else {
                                assert.equal(res[0].userEmail.length, 1);
                                assert.equal(res[0].children[0], res[4].id);
                                done();
                            }
                        });
                });
        });
    });

    it('2.3 delete leaf', function (done) {
        let roleName = "role 5";
        UsersAndRoles.deleteRole(roleName, (err) => {
            if (err) {
                UsersAndRoles.getAllRolesObjects((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[3].children.length, 0);
                        res.every((row) => row.roleName !== roleName);
                        done();
                    }
                });
            } else
                done(new Error("should not happen"))
        });
    });

    it('2.4 invalid delete', function (done) {
        let roleName = "role 10";
        UsersAndRoles.deleteRole(roleName, (err) => {
            if (err) done();
            else done(new Error("should not happen"));
        });
    });
});