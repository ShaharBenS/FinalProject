let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;

let globalBefore = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
};

let globalAfter = function () {
    mongoose.connection.close();
};

let globalAfterEach = function () {
    mongoose.connection.db.dropDatabase();
};


describe('1. addUsersAndRole', function () {

    before(globalBefore);
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
                    done(new Error("should have failed"));
                }
            });
        });
    });
});

