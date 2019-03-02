let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let modelUsersAndRoles = require('../../models/schemas/usersSchemas/UsersAndRolesSchema');
let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;

let globalBefore = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
};

let globalBeforeEach = function () {
    modelUsersAndRoles.createIndexes();
};

let globalAfter = function () {
    mongoose.connection.close();
};

let globalAfterEach = function () {
    mongoose.connection.db.dropDatabase();
};

describe('1. addUsersAndRole', function () {

    before(globalBefore);
    beforeEach(globalBeforeEach);
    afterEach(globalAfterEach);
    after(globalAfter);


    it('1.1 adds 1 valid role', function (done) {
        usersAndRolesController.addUsersAndRole('role1', ['a@b.c'], (err, userAndRole) => {
            if (err) done(err);
            else {
                assert.deepEqual(userAndRole.userEmail, ['a@b.c']);
                assert.deepEqual(userAndRole.children, []);
                assert.deepEqual(userAndRole.roleName, 'role1');
                done();
            }
        });
    });

    it('1.2 adds the same role', function (done) {
        usersAndRolesController.addUsersAndRole('role1', ['a@b.c'], (err, userAndRole) => {
            if (err) done(err);
            else usersAndRolesController.addUsersAndRole('role1', ['a@b.c'], (err, userAndRole2) => {
                if (err) done();
                else {
                    console.log(userAndRole);
                    console.log(userAndRole2);
                    done(new Error("should not allow duplicated roles"));
                }
            });
        });
    });

    it('1.3 adds the same email', function (done) {
        usersAndRolesController.addUsersAndRole('role1', ['a@b.c', 'a@b.c'], (err, userAndRole) => {
            if (err) done();
            else done(new Error("should not allow duplicated email addresses"))
        });
    });
});


describe('2. getAllRoles', function () {

    before(globalBefore);
    beforeEach(globalBeforeEach);
    afterEach(globalAfterEach);
    after(globalAfter);


    it('2.1 checks on empty db', function (done) {
        usersAndRolesController.getAllRoles((err, roles) => {
            if (err) done(err);
            else {
                assert.deepEqual([], roles);
                done();
            }
        })
    });

    it('2.2 checks on several roles', function (done) {
        usersAndRolesController.addUsersAndRole('role0', ['a1@b.c'], (err, role0) => {
            usersAndRolesController.addUsersAndRole('role1', ['a2@b.c'], (err, role1) => {
                usersAndRolesController.addUsersAndRole('role2', ['a3@b.c'], (err, role2) => {
                    usersAndRolesController.getAllRoles((err, roles) => {
                        if (err) done(err);
                        else {
                            assert.equal(3, roles.length);
                            assert.equal('role0', roles[0].roleName);
                            assert.equal('role1', roles[1].roleName);
                            assert.equal('role2', roles[2].roleName);
                            assert.deepEqual(role0.id, roles[0].id);
                            assert.deepEqual(role1.id, roles[1].id);
                            assert.deepEqual(role2.id, roles[2].id);
                            done();
                        }
                    });
                });
            });
        });
    });
});

describe('3. addChildrenToRole', function () {

    before(globalBefore);
    beforeEach(globalBeforeEach);
    afterEach(globalAfterEach);
    after(globalAfter);

    it('3.1 adds one child', function (done) {
        usersAndRolesController.addUsersAndRole('role0', [], (_, role0) => {
            usersAndRolesController.addUsersAndRole('childOfRole0', [], (_, child) => {
                usersAndRolesController.addChildrenToRole(role0._id, child._id, (err, modificationMsg) => {
                    if (err) done(err);
                    else {
                        assert.equal(1, modificationMsg.ok);
                        usersAndRolesController.getRoleByRoleName('role0', (err, role) => {
                            if (err) done(err);
                            else if (role === null) done(new Error("role does not exists"));
                            else {
                                assert.deepEqual([child._id], role.children);
                                assert.deepEqual([], role.userEmail);
                                assert.equal('role0', role.roleName);
                                done();
                            }
                        });
                    }
                })
            })
        });
    });

    it('3.2 adds several children', function (done) {
        usersAndRolesController.addUsersAndRole('role0', [], (_, role0) => {
            usersAndRolesController.addUsersAndRole('child1OfRole0', [], (_, child1) => {
                usersAndRolesController.addUsersAndRole('child2OfRole0', [], (_, child2) => {
                    usersAndRolesController.addUsersAndRole('child3OfRole0', [], (_, child3) => {
                        usersAndRolesController.addChildrenToRole(role0._id, child1._id, (_, modificationMsg1) => {
                            usersAndRolesController.addChildrenToRole(role0._id, child2._id, (_, modificationMsg2) => {
                                usersAndRolesController.addChildrenToRole(role0._id, child3._id, (_, modificationMsg3) => {
                                    assert.equal(1, modificationMsg1.ok);
                                    assert.equal(1, modificationMsg2.ok);
                                    assert.equal(1, modificationMsg3.ok);
                                    usersAndRolesController.getRoleByRoleName('role0', (err, role) => {
                                        if (err) done(err);
                                        else if (role === null) done(new Error("role does not exists"));
                                        else {
                                            assert.deepEqual([child1._id, child2._id, child3._id], role.children);
                                            assert.deepEqual([], role.userEmail);
                                            assert.equal('role0', role.roleName);
                                            done();
                                        }
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


describe('4. getRoleByRoleName', function () {

    before(globalBefore);
    beforeEach(globalBeforeEach);
    afterEach(globalAfterEach);
    after(globalAfter);

    it('4.1 checks on invalid role', function (done) {
        usersAndRolesController.getRoleByRoleName('MyNotExistingRole', (err, res) => {
            if (err === null && res === null) done();
            else done(new Error("should not return a thing"));
        });
    });

    it('4.2 checks on existing role', function (done) {
        usersAndRolesController.addUsersAndRole('role0', ['email1', 'email2'], (err, role0) => {
            if (err) done(err);
            else {
                assert.equal('role0', role0.roleName);
                assert.deepEqual(['email1', 'email2'], role0.userEmail);
                assert.deepEqual([], role0.children);
                done();
            }
        });
    });
});


describe('5. getRoleIdByUsername', function () {

    before(globalBefore);
    beforeEach(globalBeforeEach);
    afterEach(globalAfterEach);
    after(globalAfter);

    it('5.1 checks on invalid role', function (done) {
        usersAndRolesController.getRoleIdByUsername('MyNotExistingRole', (err) => {
            if (err) done();
            else done(new Error("should not return a thing"));
        });
    });

    it('5.2 checks on existing role', function (done) {
        usersAndRolesController.addUsersAndRole('role0', ['email1', 'email2'], (_, role0) => {
            usersAndRolesController.getRoleIdByUsername('email1', (err, roleID) => {
                if (err) done(err);
                else {
                    assert.deepEqual(role0._id, roleID);
                    done()
                }
            });
        });
    });
});

describe('6. getRoleNameByRoleID', function () {

    before(globalBefore);
    beforeEach(globalBeforeEach);
    afterEach(globalAfterEach);
    after(globalAfter);

    it('6.1 checks on invalid role', function (done) {
        usersAndRolesController.getRoleNameByRoleID('MyNotExistingRole', (err) => {
            if (err) done();
            else done(new Error("should not return a thing"));
        });
    });

    it('6.2 checks on existing role', function (done) {
        this.timeout(5000);
        usersAndRolesController.addUsersAndRole('role0', ['email1', 'email2'], (_, role0) => {
            usersAndRolesController.getRoleNameByRoleID(role0._id, (err, roleName) => {
                if (err) done(err);
                else {
                    assert.equal('role0', roleName);
                    done()
                }
            });
        });
    });
});
