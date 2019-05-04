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

let formName = "myFormName";
let formName2 = "myFormName2";
let formName3 = "myFormName3";
let formName4 = "myFormName4";
let formName5 = "myFormName5";
let formSrc = "srcHTML";
let formSrc2 = "srcHTML2";


describe('1. createOnlineFrom', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);


    it('1.1 adds 2 onlineForms', function (done) {
        onlineFormController.createOnlineFrom(formName, formSrc, (err, res) => {
            if (err) done(err);
            let onlineForm = new OnlineForm(formName, formSrc, res._id);
            onlineFormController.getAllOnlineForms((err, res) => {
                if (err) done(err);
                assert.equal(1, res.length);
                assert.deepEqual(onlineForm, res[0]);

                onlineFormController.createOnlineFrom(formName2, formSrc2, (err, res) => {
                    if (err) done(err);
                    let onlineForm2 = new OnlineForm(formName2, formSrc2, res._id);
                    onlineFormController.getAllOnlineForms((err, res) => {
                        if (err) done(err);
                        assert.equal(2, res.length);
                        assert.deepEqual(onlineForm, res[0]);
                        assert.deepEqual(onlineForm2, res[1]);
                        done();
                    });
                });
            });
        })
    });

    it('1.2 adds 2 onlineForms with the same name', function (done) {
        onlineFormController.createOnlineFrom(formName, formSrc, (err, res) => {
            if (err) done(err);
            let onlineForm = new OnlineForm(formName, formSrc, res._id);
            onlineFormController.getAllOnlineForms((err, res) => {
                if (err) done(err);
                assert.equal(1, res.length);
                assert.deepEqual(onlineForm, res[0]);

                onlineFormController.createOnlineFrom(formName, formSrc2, (err) => {
                    expect(err).to.be.an('error');
                    onlineFormController.getAllOnlineForms((err, res) => {
                        if (err) done(err);
                        assert.equal(1, res.length);
                        assert.deepEqual(onlineForm, res[0]);
                        done();
                    });
                });
            });
        })
    });
});

describe('2. getAllOnlineForms', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);


    it('2.1 checks when there are no forms', function (done) {
        onlineFormController.getAllOnlineForms((err, res) => {
            if (err) done(err);
            expect(res).to.be.an('array');
            assert.equal(0, res.length);
            done();
        })
    });

    it('2.2 checks when there are 5 forms', function (done) {
        let formsArr = [];
        onlineFormController.createOnlineFrom(formName, formSrc, (err, res) => {
            if (err) done(err);
            formsArr.push(new OnlineForm(formName, formSrc, res._id));
            onlineFormController.createOnlineFrom(formName2, formSrc, (err, res) => {
                if (err) done(err);
                formsArr.push(new OnlineForm(formName2, formSrc, res._id));
                onlineFormController.createOnlineFrom(formName3, formSrc, (err, res) => {
                    if (err) done(err);
                    formsArr.push(new OnlineForm(formName3, formSrc, res._id));
                    onlineFormController.createOnlineFrom(formName4, formSrc, (err, res) => {
                        if (err) done(err);
                        formsArr.push(new OnlineForm(formName4, formSrc, res._id));
                        onlineFormController.createOnlineFrom(formName5, formSrc, (err, res) => {
                            if (err) done(err);
                            formsArr.push(new OnlineForm(formName5, formSrc, res._id));

                            onlineFormController.getAllOnlineForms((err, res) => {
                                if (err) done(err);
                                expect(res).to.be.an('array');
                                assert.equal(res.length, 5);
                                assert.equal(res.length, formsArr.length);
                                let successCounter = 0;
                                for (let j = 0; j < res.length; j++) {
                                    for (let i = 0; i < formsArr.length; i++) {
                                        if (res[j].formName === formsArr[i].formName) {
                                            assert.deepEqual(formsArr[i], res[j]);
                                            successCounter++;
                                            i = formsArr.length;
                                        }
                                    }
                                }
                                assert.equal(successCounter, 5);
                                done();
                            })
                        });
                    });
                });
            });
        });
    });
});


describe('3. findOnlineFormsIDsByFormsNames', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);


    it('3.1 checks for no names', function (done) {
        let namesArr = [];
        onlineFormController.findOnlineFormsIDsByFormsNames(namesArr, (err, res) => {
            if (err) done(err);
            expect(res).to.be.an('array');
            assert.equal(0, res.length);
            done();
        })
    });

    it('3.2 checks for several names', function (done) {
        let namesArr = [formName];
        onlineFormController.createOnlineFrom(formName, formSrc, (err, res) => {
            if (err) done(err);
            let formID = res._id;
            onlineFormController.findOnlineFormsIDsByFormsNames(namesArr, (err, res) => {
                if (err) done(err);
                expect(res).to.be.an('array');
                assert.equal(1, res.length);
                assert.deepEqual(res, [formID]);
                onlineFormController.createOnlineFrom(formName2, formSrc, (err, res) => {
                    if (err) done(err);
                    let formID2 = res._id;
                    onlineFormController.findOnlineFormsIDsByFormsNames(namesArr, (err, res) => {
                        if (err) done(err);
                        expect(res).to.be.an('array');
                        assert.equal(1, res.length);
                        assert.deepEqual(res, [formID]);
                        namesArr.push(formName2);
                        onlineFormController.findOnlineFormsIDsByFormsNames(namesArr, (err, res) => {
                            if (err) done(err);
                            expect(res).to.be.an('array');
                            assert.equal(2, res.length);
                            assert.deepEqual(res, [formID, formID2]);
                            done();
                        });
                    });
                });
            })
        })
    });

    it('3.3 checks for names that does not exist', function (done) {
        let formsArrWrong = ["this", "name", "does", "not", "exist"];
        let formsArrAllGood = [formName, formName2, formName3, formName4, formName5];
        let formsArrHalfAll = [formName, formName3, formName5];
        let formsArrHalfGoodHalfWrong = [formName, formName4, "does", "not", "true"];

        let formsArr = [];

        onlineFormController.createOnlineFrom(formName, formSrc, (err, res) => {
            if (err) done(err);
            formsArr.push(res._id);
            onlineFormController.createOnlineFrom(formName2, formSrc, (err, res) => {
                if (err) done(err);
                formsArr.push(res._id);
                onlineFormController.createOnlineFrom(formName3, formSrc, (err, res) => {
                    if (err) done(err);
                    formsArr.push(res._id);
                    onlineFormController.createOnlineFrom(formName4, formSrc, (err, res) => {
                        if (err) done(err);
                        formsArr.push(res._id);
                        onlineFormController.createOnlineFrom(formName5, formSrc, (err, res) => {
                            if (err) done(err);
                            formsArr.push(res._id);

                            onlineFormController.findOnlineFormsIDsByFormsNames(formsArrWrong, (err, res) => {
                                if (err) done(err);
                                expect(res).to.be.an('array');
                                assert.equal(res.length, 0);
                                onlineFormController.findOnlineFormsIDsByFormsNames(formsArrAllGood, (err, res) => {
                                    if (err) done(err);
                                    expect(res).to.be.an('array');
                                    assert.equal(res.length, 5);
                                    assert.deepEqual(res, formsArr);
                                    onlineFormController.findOnlineFormsIDsByFormsNames(formsArrHalfAll, (err, res) => {
                                        if (err) done(err);
                                        expect(res).to.be.an('array');
                                        assert.equal(res.length, 3);
                                        assert.deepEqual(res, [formsArr[0], formsArr[2], formsArr[4]]);
                                        onlineFormController.findOnlineFormsIDsByFormsNames(formsArrHalfGoodHalfWrong, (err, res) => {
                                            if (err) done(err);
                                            expect(res).to.be.an('array');
                                            assert.equal(res.length, 2);
                                            assert.deepEqual(res, [formsArr[0], formsArr[3]]);
                                            done();
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
});


describe('4. findOnlineFormsNamesByFormsIDs', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);


    it('4.1 checks for no names', function (done) {
        let namesArr = [];
        onlineFormController.findOnlineFormsNamesByFormsIDs(namesArr, (err, res) => {
            if (err) done(err);
            expect(res).to.be.an('array');
            assert.equal(0, res.length);
            done();
        })
    });

    it('4.2 checks for several ids', function (done) {
        onlineFormController.createOnlineFrom(formName, formSrc, (err, res) => {
            if (err) done(err);
            let formID = res._id;
            onlineFormController.findOnlineFormsNamesByFormsIDs([formID], (err, res) => {
                if (err) done(err);
                expect(res).to.be.an('array');
                assert.equal(1, res.length);
                assert.deepEqual(res, [formName]);
                onlineFormController.createOnlineFrom(formName2, formSrc, (err, res) => {
                    if (err) done(err);
                    let formID2 = res._id;
                    onlineFormController.findOnlineFormsNamesByFormsIDs([formID], (err, res) => {
                        if (err) done(err);
                        expect(res).to.be.an('array');
                        assert.equal(1, res.length);
                        assert.deepEqual(res, [formName]);
                        onlineFormController.findOnlineFormsNamesByFormsIDs([formID, formID2], (err, res) => {
                            if (err) done(err);
                            expect(res).to.be.an('array');
                            assert.equal(2, res.length);
                            assert.deepEqual(res, [formName, formName2]);
                            done();
                        });
                    });
                });
            })
        })
    });

    it('4.3 checks for ids that does not exist', function (done) {
        let formsArrWrong = [new ObjectID(1), new ObjectID(2), new ObjectID(3), new ObjectID(4), new ObjectID(5)];
        let formsArrAllGood = [];
        let formsArrHalfAll = [];
        let formsArrHalfGoodHalfWrong = [new ObjectID(1), new ObjectID(2), new ObjectID(3)];


        onlineFormController.createOnlineFrom(formName, formSrc, (err, res) => {
            if (err) done(err);
            formsArrAllGood.push(res._id);
            formsArrHalfAll.push(res._id);
            formsArrHalfGoodHalfWrong.push(res._id);
            onlineFormController.createOnlineFrom(formName2, formSrc, (err, res) => {
                if (err) done(err);
                formsArrAllGood.push(res._id);
                onlineFormController.createOnlineFrom(formName3, formSrc, (err, res) => {
                    if (err) done(err);
                    formsArrAllGood.push(res._id);
                    formsArrHalfAll.push(res._id);
                    onlineFormController.createOnlineFrom(formName4, formSrc, (err, res) => {
                        if (err) done(err);
                        formsArrAllGood.push(res._id);
                        formsArrHalfGoodHalfWrong.push(res._id);
                        onlineFormController.createOnlineFrom(formName5, formSrc, (err, res) => {
                            if (err) done(err);
                            formsArrAllGood.push(res._id);
                            formsArrHalfAll.push(res._id);
                            onlineFormController.findOnlineFormsNamesByFormsIDs(formsArrWrong, (err, res) => {
                                if (err) done(err);
                                expect(res).to.be.an('array');
                                assert.equal(res.length, 0);
                                onlineFormController.findOnlineFormsNamesByFormsIDs(formsArrAllGood, (err, res) => {
                                    if (err) done(err);
                                    expect(res).to.be.an('array');
                                    assert.equal(res.length, 5);
                                    expect(res).to.include.members([formName, formName2, formName3, formName4, formName5]);
                                    onlineFormController.findOnlineFormsNamesByFormsIDs(formsArrHalfAll, (err, res) => {
                                        if (err) done(err);
                                        expect(res).to.be.an('array');
                                        assert.equal(res.length, 3);
                                        expect(res).to.include.members([formName, formName3, formName5]);
                                        onlineFormController.findOnlineFormsNamesByFormsIDs(formsArrHalfGoodHalfWrong, (err, res) => {
                                            if (err) done(err);
                                            expect(res).to.be.an('array');
                                            assert.equal(res.length, 2);
                                            expect(res).to.include.members([formName, formName4]);
                                            done();
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
});


describe('5. getOnlineFormByName', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);


    it('5.1 checks for not existed name', function (done) {
        onlineFormController.getOnlineFormByName("wrongName", (err, res) => {
            expect(err).to.be.a('null');
            expect(res).to.be.a('null');
            done();
        });
    });

    it('5.2 find sever form names', function (done) {
        let formsArr = [];
        onlineFormController.createOnlineFrom(formName, formSrc, (err, res) => {
            if (err) done(err);
            formsArr.push(new OnlineForm(formName, formSrc, res._id));
            onlineFormController.createOnlineFrom(formName2, formSrc, (err, res) => {
                if (err) done(err);
                formsArr.push(new OnlineForm(formName2, formSrc, res._id));
                onlineFormController.createOnlineFrom(formName3, formSrc, (err, res) => {
                    if (err) done(err);
                    formsArr.push(new OnlineForm(formName3, formSrc, res._id));
                    onlineFormController.createOnlineFrom(formName4, formSrc, (err, res) => {
                        if (err) done(err);
                        formsArr.push(new OnlineForm(formName4, formSrc, res._id));
                        onlineFormController.createOnlineFrom(formName5, formSrc, (err, res) => {
                            if (err) done(err);
                            formsArr.push(new OnlineForm(formName5, formSrc, res._id));

                            onlineFormController.getOnlineFormByName(formName, (err, res) => {
                                if (err) done(err);
                                assert.deepEqual(res, formsArr[0]);
                                onlineFormController.getOnlineFormByName(formName2, (err, res) => {
                                    if (err) done(err);
                                    assert.deepEqual(res, formsArr[1]);
                                    onlineFormController.getOnlineFormByName(formName3, (err, res) => {
                                        if (err) done(err);
                                        assert.deepEqual(res, formsArr[2]);
                                        onlineFormController.getOnlineFormByName(formName4, (err, res) => {
                                            if (err) done(err);
                                            assert.deepEqual(res, formsArr[3]);
                                            onlineFormController.getOnlineFormByName(formName5, (err, res) => {
                                                if (err) done(err);
                                                assert.deepEqual(res, formsArr[4]);
                                                done();
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
    });
});


describe('6. createAllOnlineForms', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);


    it('6.1 checks that all files exists', function (done) {
        this.timeout(10000);
        let fs = require('fs');
        let files = fs.readdirSync(__dirname + "\\..\\..\\views\\onlineFormViews\\");
        let length = 0;
        for (let i in files) {
            let fileName = files[i];
            if (fileName !== 'form_template.html' && fileName.substring(fileName.length - 5) === '.html') {
                length++;
            }
        }
        onlineFormController.createAllOnlineForms(() => {
            onlineFormController.getAllOnlineForms((err, res) => {
                if (err) done(err);
                assert.equal(res.length, length);
                done();
            });
        });
    })
});