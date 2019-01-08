let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let expect = require('chai').expect;
let ActiveProcess = require('../../domainObjects/activeProcess');
let ActiveProcessStage = require('../../domainObjects/activeProcessStage');


const processName1 = "proc name 1";
const timeCreation = new Date();
const notificationTime = 10;
const currentStages = [0];
const initials = [0, 1];

let testProcess;

const onlineForms = [];
const filledOnlineForms = [];
const attachedFilesNames = [];
const comments = "";
const roleID = 0;

let stage0, stage1, stage2, stage3, stage4, stage5, stage6;

let createActiveProcess1 = function () {

    /*
           +---+
           | 0 |
           +-+-+
             |
             v
           +-+-+
      +----+ 1 +----+
      |    +---+    |
      |             |
    +-v-+         +-v-+
    | 2 |         | 3 |
    +-+-+         +-+-+
      |             |
      v             v
    +-+-+         +-+-+
    | 4 |         | 5 |
    +-+-+         +-+-+
      |             |
      |    +---+    |
      +----> 6 <----+
           +---+
    */
    stage0 = new ActiveProcessStage(roleID, undefined, 0, [1], [], [], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    stage1 = new ActiveProcessStage(roleID, undefined, 1, [2, 3], [0], [0], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    stage2 = new ActiveProcessStage(roleID, undefined, 2, [4], [1], [1], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    stage3 = new ActiveProcessStage(roleID, undefined, 3, [5], [1], [1], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    stage4 = new ActiveProcessStage(roleID, undefined, 4, [6], [2], [2], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    stage5 = new ActiveProcessStage(roleID, undefined, 5, [6], [3], [3], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    stage6 = new ActiveProcessStage(roleID, undefined, 6, [], [4, 5], [4, 5], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ActiveProcess(processName1, timeCreation, notificationTime, currentStages.slice(), initials, stages);
};


describe('1.0 add to current stages', function () {

    beforeEach(createActiveProcess1);

    it('1.1 checks for existing stage', () => {
        assert.deepEqual([0], testProcess.currentStages);
        testProcess.addCurrentStage(1);
        assert.deepEqual([0, 1], testProcess.currentStages);
    });

    it('1.2 checks for existing stage in current stages', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.addCurrentStage(0)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
    });

    it('1.3 checks for undefined value', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.addCurrentStage(undefined)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
    });
});

describe('2.0 remove current stages', function () {

    beforeEach(createActiveProcess1);

    it('2.1 checks for existing stage', () => {
        assert.deepEqual([0], testProcess.currentStages);
        testProcess.removeCurrentStage(0);
        assert.deepEqual([], testProcess.currentStages);
    });

    it('2.2 checks for not existing stage in current stages', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.removeCurrentStage(1)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
    });

    it('2.3 checks for undefined value', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.removeCurrentStage(undefined)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
    });
});

describe('3.0 set time creation', function () {

    beforeEach(createActiveProcess1);

    it('3.1 checks for initial define', () => {
        assert.deepEqual(timeCreation, testProcess.timeCreation);
    });

    it('3.2 define time again', () => {
        expect(() => {
            testProcess.timeCreation = new Date()
        }).to.throw();
        assert.deepEqual(timeCreation, testProcess.timeCreation);
    });
});

describe('4.0 get stage by stage number', function () {

    beforeEach(createActiveProcess1);

    it('4.1 get existing stage', () => {
        assert.deepEqual(stage0, testProcess.getStageByStageNum(0));
        assert.deepEqual(stage1, testProcess.getStageByStageNum(1));
        assert.deepEqual(stage2, testProcess.getStageByStageNum(2));
        assert.deepEqual(stage3, testProcess.getStageByStageNum(3));
        assert.deepEqual(stage4, testProcess.getStageByStageNum(4));
        assert.deepEqual(stage5, testProcess.getStageByStageNum(5));
        assert.deepEqual(stage6, testProcess.getStageByStageNum(6));
    });

    it('4.2 get not existing stage', () => {
        expect(() => {
            testProcess.getStageByStageNum(-1)
        }).to.throw();
        expect(() => {
            testProcess.getStageByStageNum(7)
        }).to.throw();
        expect(() => {
            testProcess.getStageByStageNum(1.5)
        }).to.throw();
        expect(() => {
            testProcess.getStageByStageNum("a")
        }).to.throw();

        // check for no side effects
        assert.deepEqual(stage0, testProcess.getStageByStageNum(0));
        assert.deepEqual(stage1, testProcess.getStageByStageNum(1));
        assert.deepEqual(stage2, testProcess.getStageByStageNum(2));
        assert.deepEqual(stage3, testProcess.getStageByStageNum(3));
        assert.deepEqual(stage4, testProcess.getStageByStageNum(4));
        assert.deepEqual(stage5, testProcess.getStageByStageNum(5));
        assert.deepEqual(stage6, testProcess.getStageByStageNum(6));
    });
});


describe('5.0 get path', function () {

    beforeEach(createActiveProcess1);

    let compare = function (array1, array2) {
        return (array1.some(function (v) {
            return array2.indexOf(v) >= 0;
        }) && array2.some(function (v) {
            return array1.indexOf(v) >= 0;
        }));
    };

    it('5.1 get existing paths', () => {
        assert.isTrue(compare([0, 1, 2, 3, 4, 5, 6], testProcess.getPath(0)));
        assert.isTrue(compare([1, 2, 3, 4, 5, 6], testProcess.getPath(1)));
        assert.isTrue(compare([2, 4, 6], testProcess.getPath(2)));
        assert.isTrue(compare([3, 5, 6], testProcess.getPath(3)));
        assert.isTrue(compare([4, 6], testProcess.getPath(4)));
        assert.isTrue(compare([5, 6], testProcess.getPath(5)));
        assert.isTrue(compare([6], testProcess.getPath(6)));
    });

    it('5.2 get path from not existing stage num', () => {
        expect(() => {
            testProcess.getPath(-1)
        }).to.throw();
        expect(() => {
            testProcess.getPath(7)
        }).to.throw();
        expect(() => {
            testProcess.getPath(1.5)
        }).to.throw();
        expect(() => {
            testProcess.getPath("a")
        }).to.throw();

        // check for no side effects
        assert.isTrue(compare([0, 1, 2, 3, 4, 5, 6], testProcess.getPath(0)));
        assert.isTrue(compare([1, 2, 3, 4, 5, 6], testProcess.getPath(1)));
        assert.isTrue(compare([2, 4, 6], testProcess.getPath(2)));
        assert.isTrue(compare([3, 5, 6], testProcess.getPath(3)));
        assert.isTrue(compare([4, 6], testProcess.getPath(4)));
        assert.isTrue(compare([5, 6], testProcess.getPath(5)));
        assert.isTrue(compare([6], testProcess.getPath(6)));
    });
});

describe('6.0 remove stage', function () {

    beforeEach(createActiveProcess1);

    it('6.1 removes existing stage', () => {
        assert.equal(testProcess.stages.length, 7);
        testProcess.removeStage(0);
        assert.equal(testProcess.stages.length, 6);
        expect(() => testProcess.getStageByStageNum(0)).to.throw();
        assert.deepEqual(testProcess.getStageByStageNum(1).stagesToWaitFor, []);

    });

    it('6.2 removes not existing stage', () => {
        expect(() => testProcess.getStageByStageNum(-1)).to.throw();
        expect(() => testProcess.getStageByStageNum(7)).to.throw();
        expect(() => testProcess.getStageByStageNum(8)).to.throw();
        expect(() => testProcess.getStageByStageNum(2.4)).to.throw();
    });
});

