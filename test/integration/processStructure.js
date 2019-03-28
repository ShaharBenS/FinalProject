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


});