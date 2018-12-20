let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let UsersAndRoles = require('../../controllers/users/UsersAndRoles');

// variables
let noFather = "";
let root = "role 1";
let son_root = "role 2";
let role3 = "role 3";
let role4 = "role 4";
let role5 = "role 5";
let username = "random@bgu.aguda.ac.il";
let username2 = "random2@bgu.aguda.ac.il";
let username3 = "random3@bgu.aguda.ac.il";

let base_structure = function (done) {
    UsersAndRoles.addNewRole(root, "", () => {
        UsersAndRoles.addNewRole(son_root, root, () => {
            UsersAndRoles.addNewRole(role3, root, () => {
                UsersAndRoles.addNewRole(role4, son_root, () => {
                    UsersAndRoles.addNewRole(role5, role4, () => {
                        done();
                    });
                });
            });
        });
    });
};

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
        UsersAndRoles.addNewRole(root, noFather, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRoles((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[0].roleName, root);
                        done();
                    }
                });
        });
    });

    it('1.2 add role with father', function (done) {
        UsersAndRoles.addNewRole(son_root, root, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRolesObjects((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[1].roleName, son_root);
                        assert.equal(res[0].children[0], res[1].id);
                        done();
                    }
                });
        });
    });

    it('1.3 shouldn\'t add role with INVALID father', function (done) {
        let fatherRoleName = "INVALID ROLE";
        UsersAndRoles.addNewRole(role3, fatherRoleName, (err) => {
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

        UsersAndRoles.addNewRole(root, noFather, () => {
            UsersAndRoles.addNewRole(son_root, root, () => {
                UsersAndRoles.addNewRole(role3, root, () => {
                    UsersAndRoles.addNewRole(role4, son_root, () => {
                        UsersAndRoles.addNewRole(role5, role4, () => {
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


describe('3. add user to role', function () {

    before(async function () {
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.set('useCreateIndex', true);
    });

    beforeEach((done) => base_structure(done));

    afterEach(function (done) {
        mongoose.connection.db.dropDatabase();
        done();
    });

    after(function () {
        mongoose.connection.close();

    });

    it('3.1 add root user', function (done) {
        UsersAndRoles.addNewUserToRole(username, root, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRolesObjects((err, res) => {
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
        UsersAndRoles.addNewUserToRole(username,role3,(err) => {
            if (err) done(err);
            else
                UsersAndRoles.addNewUserToRole(username,role3, (err) => {
                    if (err) done();
                    else done(new Error("should not happen"))
                });
        });
    });

    it('3.3 add multiple users to role', function (done) {
        UsersAndRoles.addNewUserToRole(username, son_root, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.addNewUserToRole(username2, son_root, (err) => {
                    if (err) done(err);
                    else
                        UsersAndRoles.addNewUserToRole(username3, son_root, (err) => {
                            if (err) done(err);
                            else {
                                UsersAndRoles.getAllRolesObjects((err, res) => {
                                    if (err) done(err);
                                    else {
                                        assert.equal(res[1].userEmail.length, 3);
                                        assert.equal(res[1].userEmail[0], username);
                                        assert.equal(res[1].userEmail[1], username2);
                                        assert.equal(res[1].userEmail[2], username3);
                                        done();
                                    }
                                });
                            }
                        });
                });
        });
    });
});


describe('4. change role name', function () {

    before(async function () {
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.set('useCreateIndex', true);
    });

    beforeEach((done) => base_structure(done));

    afterEach(function (done) {
        mongoose.connection.db.dropDatabase();
        done();
    });

    after(function () {
        mongoose.connection.close();

    });

    it('4.1 change root role name', function (done) {
        UsersAndRoles.changeRoleName(root, "root", (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRolesObjects((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[0].roleName, "root");
                        done();
                    }
                });
        });
    });

    it('4.2 change role name with father', function (done) {
        UsersAndRoles.changeRoleName(son_root, "node 0", (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRolesObjects((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[1].roleName, "node 0");
                        assert.equal(res[0].children[0], res[1].id);
                        done();
                    }
                });
        });
    });

    it('4.3 change role name to existing role', function (done) {
        UsersAndRoles.changeRoleName(root, role4, (err) => {
            if (err) done();
            else done(new Error("should not be here"));
        });
    });

    it('4.4 change role name to empty role string', function (done) {
        UsersAndRoles.changeRoleName(root, "", (err) => {
            if (err) done();
            else done(new Error("should not be here"));
        });
    });
});

describe('5. delete user from role', function () {

    before(async function () {
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.set('useCreateIndex', true);
    });

    beforeEach((done) => {
        base_structure(() => {
            UsersAndRoles.addNewUserToRole(username, root, () => {
                UsersAndRoles.addNewUserToRole(username2, son_root, () => {
                    UsersAndRoles.addNewUserToRole(username3, son_root, () => {
                        done()
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

    it('5.1 delete user from root', function (done) {
        UsersAndRoles.deleteUserFromRole(username, root, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRolesObjects((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[0].userEmail.length, 0);
                        assert.equal(res[0].roleName, root);
                        done();
                    }
                });
        });
    });

    it('5.2 delete user from multiple list', function (done) {
        UsersAndRoles.deleteUserFromRole(username2, son_root, (err) => {
            if (err) done(err);
            else
                UsersAndRoles.getAllRolesObjects((err, res) => {
                    if (err) done(err);
                    else {
                        assert.equal(res[1].userEmail.length, 1);
                        done();
                    }
                });
        });
    });

    it('5.3 delete invalid user (role have 1 username)', function (done) {
        UsersAndRoles.deleteUserFromRole(username3, root, (err) => {
            if (err) done();
            else done(new Error("this should not happen"));
        });
    });

    it('5.4 delete invalid user (role have no usernames)', function (done) {
        UsersAndRoles.deleteUserFromRole(username3, role5, (err) => {
            if (err) done();
            else done(new Error("this should not happen"));
        });
    });

});