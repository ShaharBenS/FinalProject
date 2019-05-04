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
const today = new Date();

let stage0, stage1;
let initStages = function () {
    stage0 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'ByDereg', dereg: '2', stageNum: 1, nextStages: [2], stagesToWaitFor: [0], originStagesToWaitFor: [0], attachedFilesNames: attachedFilesNames, userEmail: 'a@bgu.ac.il', assignmentTime: today, approvalTime: null, notificationsCycle:1, comments:comments});
    stage1 = new ActiveProcessStage({roleID: {id : Buffer.from('5')}, kind: 'ByDereg', dereg: '2', stageNum: 1, nextStages: [1], stagesToWaitFor: [], originStagesToWaitFor: [], attachedFilesNames: attachedFilesNames, userEmail: 'a@bgu.ac.il', assignmentTime: today, approvalTime: null, notificationsCycle:1, comments:comments});
};


describe('1.0 remove stages to wait for', function () {

    beforeEach(initStages);

    it('1.1 removes a stage normally', () => {
        assert.deepEqual(stage0.stagesToWaitFor, [0]);
        stage0.removeStagesToWaitFor([0]);
        assert.deepEqual(stage0.stagesToWaitFor, []);
    });

    it('1.2 removes stage that does not wait for', () => {
        assert.deepEqual(stage0.stagesToWaitFor, [0]);
        stage0.removeStagesToWaitFor([1]);
        assert.deepEqual(stage0.stagesToWaitFor, [0]);
    });

    it('1.3 removes non numeric stage', () => {
        assert.deepEqual(stage0.stagesToWaitFor, [0]);
        expect(() => stage0.removeStagesToWaitFor([undefined])).to.throw();
        assert.deepEqual(stage0.stagesToWaitFor, [0]);
    });
});

describe('2.0 add stages to wait for', function () {

    beforeEach(initStages);

    it('2.1 add a stage normally', () => {
        assert.deepEqual(stage0.stagesToWaitFor, [0]);
        stage0.addStagesToWaitFor([1]);
        assert.deepEqual(stage0.stagesToWaitFor, [0,1]);
    });

    it('2.2 add stage that already waits wait for', () => {
        assert.deepEqual(stage0.stagesToWaitFor, [0]);
        stage0.addStagesToWaitFor([0]);
        assert.deepEqual(stage0.stagesToWaitFor, [0]);
    });

    it('2.3 add non numeric stage', () => {
        assert.deepEqual(stage0.stagesToWaitFor, [0]);
        expect(() => stage0.addStagesToWaitFor([undefined])).to.throw();
        assert.deepEqual(stage0.stagesToWaitFor, [0]);
    });
});

describe('3.0 remove next stages', function () {

    beforeEach(initStages);

    it('3.1 removes a stage normally', () => {
        assert.deepEqual(stage0.nextStages, [2]);
        stage0.removeNextStages([2]);
        assert.deepEqual(stage0.nextStages, []);
    });

    it('3.2 removes stage that isnt next', () => {
        assert.deepEqual(stage0.nextStages, [2]);
        stage0.removeNextStages([1]);
        assert.deepEqual(stage0.nextStages, [2]);
    });

    it('3.3 removes non numeric stage', () => {
        assert.deepEqual(stage0.nextStages, [2]);
        expect(() => stage0.removeNextStages([undefined])).to.throw();
        assert.deepEqual(stage0.nextStages, [2]);
    });
});

describe('4.0 add next stages', function () {

    beforeEach(initStages);

    it('4.1 add a stage normally', () => {
        assert.deepEqual(stage0.nextStages, [2]);
        stage0.addNextStages([3]);
        assert.deepEqual(stage0.nextStages, [2,3]);
    });

    it('4.2 add stage that already waits wait for', () => {
        assert.deepEqual(stage0.nextStages, [2]);
        stage0.addNextStages([2]);
        assert.deepEqual(stage0.nextStages, [2]);
    });

    it('4.3 add non numeric stage', () => {
        assert.deepEqual(stage0.nextStages, [2]);
        expect(() => stage0.addNextStages([undefined])).to.throw();
        assert.deepEqual(stage0.nextStages, [2]);
    });
});

describe('5.0 handle stage', function () {

    beforeEach(initStages);

    it('5.1 handles unhandled stage', () => {
        assert.equal(stage1.approvalTime, undefined);
        stage1.handleStage();
        assert.notEqual(stage1.approvalTime, null);
    });

    it('5.2 handles and than handles again', () => {
        assert.equal(stage1.approvalTime, undefined);
        stage1.handleStage();
        expect(() => stage0.handleStage(["file1.txt"], "this is a comment")).to.throw();
    });

    it('5.3 handles stage that cannot be handled', () => {
        expect(() => stage0.handleStage().to.throw());
    });
});


describe('6.0 have no one to wait for', function () {

    beforeEach(initStages);

    it('6.1 have someone to wait for', () => {
        assert.equal(stage0.haveNoOneToWaitFor(), false);
    });

    it('6.2 have no one to wait for', () => {
        assert.equal(stage1.haveNoOneToWaitFor(), true);
    });
});