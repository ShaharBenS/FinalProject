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

    it.skip('1.3 shouldn\'t add role with INVALID father', function (done) {
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

    beforeEach(async function () {
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.set('useCreateIndex', true);
        UsersAndRoles.addNewRole("role 1", "", () => {
            UsersAndRoles.addNewRole("role 2", "role 1", () => {
                UsersAndRoles.addNewRole("role 3", "role 1", () => {
                    UsersAndRoles.addNewRole("role 4", "role 2", () => {
                        UsersAndRoles.addNewRole("role 5", "role 4", () => {

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
                        assert.equal(res[1].children[0], res[4].id);
                        done();
                    }
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
            else done(new Error("should not happen"))
        });
    });
})
;