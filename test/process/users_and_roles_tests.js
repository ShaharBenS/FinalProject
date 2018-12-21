let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let UsersAndRoles = require('../../controllers/users/UsersAndRoles');

describe('add user', function () {

    before(async function () {
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.set('useCreateIndex', true)

    });

    after(function () {
        mongoose.connection.db.dropDatabase();
        mongoose.connection.close();
    });

    it('add  root role', function (done) {
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

    it('add role with father', function (done) {
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

    it.skip('shouldn\'t add role with INVALID father', function (done) {
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
            }
            else
               done(new Error("should not happen"))
        });
    });

});