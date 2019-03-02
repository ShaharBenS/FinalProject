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
    modelUsersAndRoles.ensureIndexes();
};

let globalAfter = function () {
    mongoose.connection.close();
};

let globalAfterEach = function () {
    mongoose.connection.db.dropDatabase();
};

let compareRoles = function (role1, role2) {
    assert.equal(role1.roleName, role2.roleName);
    assert.deepEqual(role1.children, role2.children);
    assert.deepEqual(role1.userEmail, role2.userEmail);
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

