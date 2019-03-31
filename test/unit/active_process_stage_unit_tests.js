let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let expect = require('chai').expect;
let ActiveProcessStage = require('../../domainObjects/activeProcessStage');


const onlineForms = [];
const filledOnlineForms = [];
const attachedFilesNames = [];
const comments = "";
const roleID = 0;

let stage0, stage1;
let initStages = function () {
    stage0 = new ActiveProcessStage({role: {roleName: '', id: 0}, stageNum: 0, nextStages: [1], stagesToWaitFor: [], onlineForms: [], attachedFilesNames: [], user: {userName: 'user1', id: 0}, originStagesToWaitFor: [], approvalTime: null, filledOnlineForms: [], comments: ''});
    stage1 = new ActiveProcessStage({role: {roleName: '', id: 0}, stageNum: 1, nextStages: [2,3], stagesToWaitFor: [0], onlineForms: [], attachedFilesNames: [], user: {userName: 'user2', id: 1}, originStagesToWaitFor: [0], approvalTime: null, filledOnlineForms: [], comments: ''});
};


describe('1.0 remove stages to wait for', function () {

    beforeEach(initStages);

    it('1.1 removes a stage normally', () => {
        assert.deepEqual(stage1.stagesToWaitFor, [0]);
        stage1.removeStagesToWaitFor([0]);
        assert.deepEqual(stage1.stagesToWaitFor, []);
    });

    it('1.2 removes stage that does not wait for', () => {
        assert.deepEqual(stage1.stagesToWaitFor, [0]);
        stage1.removeStagesToWaitFor([1]);
        assert.deepEqual(stage1.stagesToWaitFor, [0]);
    });

    it('1.3 removes non numeric stage', () => {
        assert.deepEqual(stage1.stagesToWaitFor, [0]);
        expect(() => stage1.removeStagesToWaitFor([undefined])).to.throw();
        assert.deepEqual(stage1.stagesToWaitFor, [0]);
    });
});

describe('2.0 handle stage', function () {

    beforeEach(initStages);

    it('2.1 handles unhandled stage', () => {
        assert.equal(stage0.approvalTime, undefined);
        stage0.handleStage([1], ["file1.txt"], "this is a comment");
        assert.notEqual(stage0.approvalTime, undefined);
        assert.deepEqual(stage0.filledOnlineForms, [1]);
        assert.deepEqual(stage0.attachedFilesNames, ["file1.txt"]);
        assert.deepEqual(stage0.comments, "this is a comment");

    });

    it('2.2 handles and than handles again', () => {
        assert.equal(stage0.approvalTime, undefined);
        stage0.handleStage([1], ["file1.txt"], "this is a comment");
        expect(() => stage0.handleStage([1], ["file1.txt"], "this is a comment")).to.throw();
    });

    it('2.3 handles stage that cannot be handled', () => {
        expect(() => stage1.handleStage([1], ["file1.txt"], "this is a comment")).to.throw();
    });
});


describe('3.0 have no one to wait for', function () {

    beforeEach(initStages);

    it('3.1 have someone to wait for', () => {
        assert.equal(stage0.haveNoOneToWaitFor(), true)
    });

    it('3.2 have no one to wait for', () => {
        assert.equal(stage1.haveNoOneToWaitFor(), false)
    });
});

describe('4.0 attach Online Form', function () {

    beforeEach(initStages);

    it('4.1  add online form to stage', () => {
        stage0.attachOnlineForm('form1');
        assert.equal(JSON.stringify(stage0.onlineForms), JSON.stringify(['form1']));
    });
});
