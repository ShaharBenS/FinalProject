let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let expect = require('chai').expect;
let ProcessStructure = require('../../domainObjects/processStructure');
let ProcessStructureStage = require('../../domainObjects/processStructureStage');


const structureName = "structure1";
const initials = [0, 1];


const onlineForms = [];
const attachedFilesNames = [];

let testProcess;

let stage0, stage1, stage2, stage3, stage4, stage5, stage6;

let createProcessStructure1 = function () {

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
    stage0 = new ProcessStructureStage(0, 0, [1], [], onlineForms, attachedFilesNames);
    stage1 = new ProcessStructureStage(1, 1, [2, 3], [0], [0], onlineForms, attachedFilesNames);
    stage2 = new ProcessStructureStage(2, 2, [4], [1], [1], onlineForms, attachedFilesNames);
    stage3 = new ProcessStructureStage(3, 3, [5], [1], [1], onlineForms, attachedFilesNames);
    stage4 = new ProcessStructureStage(4, 4, [6], [2], [2], onlineForms, attachedFilesNames);
    stage5 = new ProcessStructureStage(5, 5, [6], [3], [3], onlineForms, attachedFilesNames);
    stage6 = new ProcessStructureStage(6, 6, [], [4, 5], [4, 5], onlineForms, attachedFilesNames);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ProcessStructure(structureName, initials, stages, '');
};

let createProcessStructure2 = function () {
    stage0 = new ProcessStructureStage(0, 0, [1], [], onlineForms, attachedFilesNames);
    stage1 = new ProcessStructureStage(1, 1, [2, 3], [0], [0], onlineForms, attachedFilesNames);
    stage2 = new ProcessStructureStage(2, 2, [4], [1], [1], onlineForms, attachedFilesNames);
    stage3 = new ProcessStructureStage(3, 0, [5], [1], [1], onlineForms, attachedFilesNames);
    stage4 = new ProcessStructureStage(4, 4, [6], [2], [2], onlineForms, attachedFilesNames);
    stage5 = new ProcessStructureStage(5, 5, [6], [3], [3], onlineForms, attachedFilesNames);
    stage6 = new ProcessStructureStage(6, 6, [], [4, 5], [4, 5], onlineForms, attachedFilesNames);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ProcessStructure(structureName, [8,1,11], stages, '');
};

let createProcessStructure3 = function () {
    stage0 = new ProcessStructureStage(0, 0, [1], [], onlineForms, attachedFilesNames);
    stage1 = new ProcessStructureStage(1, 1, [2, 3], [0], [0], onlineForms, attachedFilesNames);
    stage2 = new ProcessStructureStage(2, 2, [], [1], [1], onlineForms, attachedFilesNames);
    stage3 = new ProcessStructureStage(3, 3, [5], [1], [1], onlineForms, attachedFilesNames);
    stage4 = new ProcessStructureStage(4, 4, [6], [2], [2], onlineForms, attachedFilesNames);
    stage5 = new ProcessStructureStage(5, 5, [6], [3], [3], onlineForms, attachedFilesNames);
    stage6 = new ProcessStructureStage(6, 6, [], [4, 5], [4, 5], onlineForms, attachedFilesNames);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ProcessStructure(structureName, [0], stages, '');
};


let createProcessStructure4 = function () {
    stage0 = new ProcessStructureStage(0, 0, [1], [], onlineForms, attachedFilesNames);
    stage1 = new ProcessStructureStage(1, 1, [2, 3], [0], [0], onlineForms, attachedFilesNames);
    stage2 = new ProcessStructureStage(2, 2, [4], [1], [1], onlineForms, attachedFilesNames);
    stage3 = new ProcessStructureStage(3, 3, [5], [1], [1], onlineForms, attachedFilesNames);
    stage4 = new ProcessStructureStage(4, 4, [6], [], [], onlineForms, attachedFilesNames);
    stage5 = new ProcessStructureStage(5, 5, [6], [3], [3], onlineForms, attachedFilesNames);
    stage6 = new ProcessStructureStage(6, 6, [], [4, 5], [4, 5], onlineForms, attachedFilesNames);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ProcessStructure(structureName, [0], stages, '');
};

describe('1.0 get initial stage by roleID', function () {

    beforeEach(createProcessStructure1);

    it('1.1 get initial stage for an existing role in an initial stage', () => {
        assert.deepEqual(1, testProcess.getInitialStageByRoleID(1));
    });

    it('1.2 get initial stage for a not existing role in an initial stage', () => {
        assert.deepEqual(-1, testProcess.getInitialStageByRoleID(2));
    });

    it('1.3 get initial stage for non existent roleID', () => {
        assert.deepEqual(-1, testProcess.getInitialStageByRoleID(11));
    });
});

describe('2.0 check for duplicate stage numbers', function () {

    it('2.1 check for duplicate stage numbers is true', () => {
        createProcessStructure2();
        assert.deepEqual(false, testProcess.checkNotDupStagesInStructure());
    });

    it('2.2 check for duplicate stage numbers is true', () => {
        createProcessStructure1();
        assert.deepEqual(true, testProcess.checkNotDupStagesInStructure());
    });
});

describe('3.0 check if initial states exist', function () {

    it('3.1 check if initial states exist is false', () => {
        createProcessStructure2();
        assert.deepEqual(false, testProcess.checkInitialsExistInProcessStages());
    });

    it('3.2 check if initial states exist is true', () => {
        createProcessStructure1();
        assert.deepEqual(true, testProcess.checkInitialsExistInProcessStages());
    });
});

describe('4.0 check if all next stages contain their previous stages', function () {

    it('4.1 check if all previous are included in their next true', () => {
        createProcessStructure1();
        assert.deepEqual(true, testProcess.checkPrevNextSymetric());
    });

    it('4.2 check if all previous are included in their next false', () => {
        createProcessStructure3();
        assert.deepEqual(false, testProcess.checkPrevNextSymetric());
    });

    it('4.3 check if all next are included in their previous true', () => {
        createProcessStructure1();
        assert.deepEqual(true, testProcess.checkNextPrevSymetric());
    });

    it('4.4 check if all next are included in their previous false', () => {
        createProcessStructure4();
        assert.deepEqual(false, testProcess.checkNextPrevSymetric());
    });
});

