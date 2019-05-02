let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let fs = require("fs");

let globalBefore = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
};

let globalAfter = function () {
    mongoose.connection.close();
};


describe('1. usersAndRolesController', function () {
    before(globalBefore);
    after(globalAfter);

    let tree8 = fs.readFileSync("./test/inputs/trees/tree8/tree8.json");
    let tree9 = fs.readFileSync("./test/inputs/trees/tree9/tree9.json");

    it('1.0 setting up tree', function (done) {

    }).timeout(30000);

    it('1.1 ', function (done) {
        processStructureController.
    }).timeout(30000);
});