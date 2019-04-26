let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let UsersAndRolesTreeSankey = require('../../controllers/usersControllers/usersAndRolesController');
let sankeyContent = require('../inputs/trees/GraphicsTree/sankeyTree');
let emailsToFullName = require('../inputs/trees/GraphicsTree/emailsToFullName');
let rolesToDereg = require('../inputs/trees/GraphicsTree/rolesToDereg');
let rolesToEmails = require('../inputs/trees/GraphicsTree/rolesToEmails');
let modelUsersAndRoles = require('../../models/schemas/usersSchemas/UsersAndRolesSchema');
let usersAndRolesTreeSankey = require('../../models/schemas/usersSchemas/UsersAndRolesTreeSankeySchema');


let globalBefore = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
};

let globalBeforeEach = function () {
    modelUsersAndRoles.createIndexes();
    usersAndRolesTreeSankey.createIndexes();
};

let globalAfter = function () {
    mongoose.connection.close();
};

let globalAfterEach = function () {
    mongoose.connection.db.dropDatabase();
};

describe('1. graphics test', function () {

    before(globalBefore);
    beforeEach(globalBeforeEach);
    afterEach(globalAfterEach);
    after(globalAfter);
    it('1.1 graphics test', function (done) {
        UsersAndRolesTreeSankey.setUsersAndRolesTree('a@outlook.co.il', sankeyContent,
            rolesToEmails,emailsToFullName,
            rolesToDereg, (err) => {
                if (err) {
                    done(err);
                }
                else{
                    done();
                }
            })
    });
});