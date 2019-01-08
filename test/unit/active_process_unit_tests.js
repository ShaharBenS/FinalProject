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

let createActiveProcess1 = function () {
    let stage0 = new ActiveProcessStage(roleID, undefined, 0, [1], [], [], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    let stage1 = new ActiveProcessStage(roleID, undefined, 1, [2, 3], [0], [0], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    let stage2 = new ActiveProcessStage(roleID, undefined, 2, [4], [1], [1], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    let stage3 = new ActiveProcessStage(roleID, undefined, 3, [5], [1], [1], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    let stage4 = new ActiveProcessStage(roleID, undefined, 4, [6], [2], [2], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    let stage5 = new ActiveProcessStage(roleID, undefined, 5, [6], [3], [3], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    let stage6 = new ActiveProcessStage(roleID, undefined, 6, [], [4, 5], [4, 5], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ActiveProcess(processName1, timeCreation, notificationTime, currentStages.slice(), initials, stages);
};

let resetActiveProcess1 = () => testProcess = undefined;

describe('1.0 add to current stages', function () {

    beforeEach(createActiveProcess1);
    afterEach(resetActiveProcess1);

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
    afterEach(resetActiveProcess1);

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