let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let expect = require('chai').expect;
let ActiveProcessStage = require('../../domainObjects/activeProcessStage');

const today = new Date();

let stage0, stage1;
let initStages = function () {
    stage0 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'ByDereg', dereg: '2', stageNum: 1, nextStages: [2], stagesToWaitFor: [0], originStagesToWaitFor: [0], userEmail: 'a@bgu.ac.il', assignmentTime: null, approvalTime: null, notificationsCycle:1});
    stage1 = new ActiveProcessStage({roleID: {id : Buffer.from('5')}, kind: 'ByDereg', dereg: '2', stageNum: 1, nextStages: [1], stagesToWaitFor: [], originStagesToWaitFor: [], userEmail: 'a@bgu.ac.il', assignmentTime: today, approvalTime: null, notificationsCycle:1});
};

describe('ActiveProcessStage', function  (){

    describe('1.0 removeStagesToWaitForIncludingOrigin', function () {

        beforeEach(initStages);

        it('1.1 removes a stage normally', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.removeStagesToWaitForIncludingOrigin([0]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.stagesToWaitFor, []);
            assert.deepEqual(stage0.originStagesToWaitFor, []);
        });

        it('1.2 removes stage that does not wait for', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.removeStagesToWaitForIncludingOrigin([1]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
        });

        it('1.3 removes non numeric stage', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.removeStagesToWaitForIncludingOrigin([undefined]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, 'removeStagesToWaitForIncludingOrigin: stages are invalid');
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
        });
    });

    describe('2.0 addStagesToWaitForIncludingOrigin', function () {

        beforeEach(initStages);

        it('2.1 add a stage normally', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.addStagesToWaitForIncludingOrigin([1]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.stagesToWaitFor, [0, 1]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0, 1]);
        });

        it('2.2 add stage that already waits wait for', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.addStagesToWaitForIncludingOrigin([0]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
        });

        it('2.3 add non numeric stage', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.addStagesToWaitForIncludingOrigin([undefined]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, 'addStagesToWaitForIncludingOrigin: stages are invalid');
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
        });
    });

    describe('3.0 removeStagesToWaitFor', function () {

        beforeEach(initStages);

        it('3.1 removes a stage normally', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.removeStagesToWaitFor([0]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.stagesToWaitFor, []);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
        });

        it('3.2 removes stage that does not wait for', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.removeStagesToWaitFor([1]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
        });

        it('3.3 removes non numeric stage', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.removeStagesToWaitFor([undefined]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, 'removeStagesToWaitFor: stages are invalid');
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
        });
    });

    describe('4.0 add stages to wait for', function () {

        beforeEach(initStages);

        it('4.1 add a stage normally', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.addStagesToWaitFor([1]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.stagesToWaitFor, [0,1]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
        });

        it('4.2 add stage that already waits wait for', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.addStagesToWaitFor([0]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
        });

        it('4.3 add non numeric stage', () => {
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
            let result = stage0.addStagesToWaitFor([undefined]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, 'addStagesToWaitFor: stages are invalid');
            assert.deepEqual(stage0.stagesToWaitFor, [0]);
            assert.deepEqual(stage0.originStagesToWaitFor, [0]);
        });
    });

    describe('5.0 remove next stages', function () {

        beforeEach(initStages);

        it('5.1 removes a stage normally', () => {
            assert.deepEqual(stage0.nextStages, [2]);
            let result = stage0.removeNextStages([2]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.nextStages, []);
        });

        it('5.2 removes stage that isnt next', () => {
            assert.deepEqual(stage0.nextStages, [2]);
            let result = stage0.removeNextStages([1]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.nextStages, [2]);
        });

        it('5.3 removes non numeric stage', () => {
            assert.deepEqual(stage0.nextStages, [2]);
            let result = stage0.removeNextStages([undefined]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, 'removeNextStages: stages are invalid');
            assert.deepEqual(stage0.nextStages, [2]);
        });
    });

    describe('6.0 add next stages', function () {

        beforeEach(initStages);

        it('6.1 add a stage normally', () => {
            assert.deepEqual(stage0.nextStages, [2]);
            let result = stage0.addNextStages([3]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.nextStages, [2,3]);
        });

        it('6.2 add stage that already waits wait for', () => {
            assert.deepEqual(stage0.nextStages, [2]);
            let result = stage0.addNextStages([2]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage0.nextStages, [2]);
        });

        it('6.3 add non numeric stage', () => {
            assert.deepEqual(stage0.nextStages, [2]);
            let result = stage0.addNextStages([undefined]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, 'addNextStages: stages are invalid');
            assert.deepEqual(stage0.nextStages, [2]);
        });
    });

    describe('7.0 handle stage', function () {

        beforeEach(initStages);

        it('7.1 handles unhandled stage', () => {
            assert.deepEqual(stage1.approvalTime, null);
            let result = stage1.handleStage();
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(stage1.approvalTime !== null, true);
        });

        it('7.2 handles when a;ready handled', () => {
            assert.deepEqual(stage1.approvalTime, null);
            stage1.approvalTime = new Date();
            let result = stage1.handleStage();
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, 'handleStage: stage already handled or is waiting for stages');
        });

        it('7.3 handles stage that cannot be handled', () => {
            assert.deepEqual(stage0.approvalTime, null);
            let result = stage0.handleStage();
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "handleStage: stage hasn't been assigned");
            assert.deepEqual(stage0.approvalTime, null);
        });
    });


    describe('8.0 haveNoOneToWaitFor', function () {

        beforeEach(initStages);

        it('8.1 have someone to wait for', () => {
            assert.equal(stage0.haveNoOneToWaitFor(), false);
        });

        it('8.2 have no one to wait for', () => {
            assert.equal(stage1.haveNoOneToWaitFor(), true);
        });
    });
});
