let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let expect = require('chai').expect;

let signatureController = require('../../controllers/usersControllers/signaturesController');
let signatureAccessor = require('../../models/accessors/signatureAccessor');

let signature = "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"
let signature2 = "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";

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

describe('1. add signature', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);


    it('1.1 adds 1 signature', function (done) {
        let userEmail = "some@randomEmail.com";
        signatureController.addSignature(userEmail, signature, (err) => {
            if (err) done(err);
            signatureAccessor.getSignature(userEmail, (err, res) => {
                if (err) done(err);
                assert.equal(signature, res);
                done();
            })
        })
    });

    it('1.2 adds signature and then adds again to the same user', function (done) {
        let userEmail = "some@randomEmail.com";

        signatureController.addSignature(userEmail, signature, (err) => {
            if (err) done(err);
            signatureController.addSignature(userEmail, signature2, (err) => {
                expect(err).to.be.an('error');
                expect(err).to.not.be.a('null');
                signatureAccessor.getSignature(userEmail, (err, res) => {
                    if (err) done(err);
                    assert.equal(signature, res);
                    done();
                })
            });
        })
    });

    it('1.3 adds signatures to different users', function (done) {
        let userEmail = "some@randomEmail.com";
        let userEmail2 = "some2@randomEmail.com";

        signatureController.addSignature(userEmail, signature, (err) => {
            if (err) done(err);
            signatureController.addSignature(userEmail2, signature2, (err) => {
                if (err) done(err);
                signatureAccessor.getSignature(userEmail, (err, res) => {
                    if (err) done(err);
                    assert.equal(signature, res);
                    signatureAccessor.getSignature(userEmail2, (err, res2) => {
                        if (err) done(err);
                        assert.equal(signature2, res2);
                        done();
                    });
                })
            });
        })
    })
});


describe('2. get signature', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);

    it('2.1 gets 1 signature', function (done) {
        let userEmail = "some@randomEmail.com";
        signatureController.addSignature(userEmail, signature, (err) => {
            if (err) done(err);
            signatureController.getSignature(userEmail, (err, res) => {
                if (err) done(err);
                assert.equal(signature, res);
                done();
            })
        })
    });

    it('2.2 gets signatures of not existing user', function (done) {
        let userEmail = "thisUser@doesNotExists.com";
        signatureController.getSignature(userEmail, (err) => {
            expect(err).to.be.an('error');
            done();
        });
    });
});


describe('3. update signature', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);

    it('3.1 updates 1 signature', function (done) {
        let userEmail = "some@randomEmail.com";
        signatureController.addSignature(userEmail, signature, (err) => {
            if (err) done(err);
            signatureController.getSignature(userEmail, (err, res) => {
                if (err) done(err);
                assert.equal(signature, res);
                signatureController.updateSignature(userEmail, signature2, (err) => {
                    if (err) done(err);
                    signatureController.getSignature(userEmail, (err, res) => {
                        if (err) done(err);
                        assert.equal(signature2, res);
                        done();
                    });
                });
            })
        })
    });

    it('3.2 updates signature of not existing user (should create it)', function (done) {
        let userEmail = "thisUser@doesNotExists.com";
        signatureController.updateSignature(userEmail, signature2, (err) => {
            if (err) done(err);
            signatureController.getSignature(userEmail, (err, res) => {
                if (err) done(err);
                assert.equal(signature2, res);
                done();
            })
        });
    });
});
