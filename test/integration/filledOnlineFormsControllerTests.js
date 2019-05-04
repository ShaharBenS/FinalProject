let mongoose = require('mongoose');
let ObjectID = require('mongodb').ObjectID;
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let expect = require('chai').expect;

let onlineFormController = require('../../controllers/onlineFormsControllers/onlineFormController');
let OnlineForm = require('../../domainObjects/onlineForm');

let connectsToTestingDatabase = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
};

let closeConnection = function () {
    mongoose.connection.close();
};

let clearDatabase = function () {
    mongoose.connection.db.dropDatabase();
};


describe('1. ', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);


    it('1.1 ', function (done) {

    });
});