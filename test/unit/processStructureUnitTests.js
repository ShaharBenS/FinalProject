let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let ProcessStructure = require('../../domainObjects/processStructure');
let ProcessStructureStage = require('../../domainObjects/processStructureStage');


const structureName = "structure1";
const initials = [0, 1];


const onlineForms = [];
const attachedFilesNames = [];

let testProcess;

let stage0, stage1, stage2, stage3, stage4, stage5, stage6;

let roleID0 = {id: 0};
let roleID1 = {id: 1};
let roleID2 = {id: 2};
let roleID3 = {id: 3};
let roleID4 = {id: 4};
let roleID5 = {id: 5};
let roleID6 = {id: 6};
let roleID11 = {id: 11};

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
    stage0 = new ProcessStructureStage(roleID0, 0, [1], [], onlineForms, attachedFilesNames);
    stage1 = new ProcessStructureStage(roleID1, 1, [2, 3], [0], [0], onlineForms, attachedFilesNames);
    stage2 = new ProcessStructureStage(roleID2, 2, [4], [1], [1], onlineForms, attachedFilesNames);
    stage3 = new ProcessStructureStage(roleID3, 3, [5], [1], [1], onlineForms, attachedFilesNames);
    stage4 = new ProcessStructureStage(roleID4, 4, [6], [2], [2], onlineForms, attachedFilesNames);
    stage5 = new ProcessStructureStage(roleID5, 5, [6], [3], [3], onlineForms, attachedFilesNames);
    stage6 = new ProcessStructureStage(roleID6, 6, [], [4, 5], [4, 5], onlineForms, attachedFilesNames);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ProcessStructure(structureName, initials, stages, '');
};

let createProcessStructure2 = function () {
    stage0 = new ProcessStructureStage(roleID0, 0, [1], [], onlineForms, attachedFilesNames);
    stage1 = new ProcessStructureStage(roleID1, 1, [2, 3], [0], [0], onlineForms, attachedFilesNames);
    stage2 = new ProcessStructureStage(roleID2, 2, [4], [1], [1], onlineForms, attachedFilesNames);
    stage3 = new ProcessStructureStage(roleID3, 0, [5], [1], [1], onlineForms, attachedFilesNames);
    stage4 = new ProcessStructureStage(roleID4, 4, [6], [2], [2], onlineForms, attachedFilesNames);
    stage5 = new ProcessStructureStage(roleID5, 5, [6], [3], [3], onlineForms, attachedFilesNames);
    stage6 = new ProcessStructureStage(roleID6, 6, [], [4, 5], [4, 5], onlineForms, attachedFilesNames);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ProcessStructure(structureName, [8,1,11], stages, '');
};

let createProcessStructure3 = function () {
    stage0 = new ProcessStructureStage(roleID0, 0, [1], [], onlineForms, attachedFilesNames);
    stage1 = new ProcessStructureStage(roleID1, 1, [2, 3], [0], [0], onlineForms, attachedFilesNames);
    stage2 = new ProcessStructureStage(roleID2, 2, [], [1], [1], onlineForms, attachedFilesNames);
    stage3 = new ProcessStructureStage(roleID3, 3, [5], [1], [1], onlineForms, attachedFilesNames);
    stage4 = new ProcessStructureStage(roleID4, 4, [6], [2], [2], onlineForms, attachedFilesNames);
    stage5 = new ProcessStructureStage(roleID5, 5, [6], [3], [3], onlineForms, attachedFilesNames);
    stage6 = new ProcessStructureStage(roleID6, 6, [], [4, 5], [4, 5], onlineForms, attachedFilesNames);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ProcessStructure(structureName, [0], stages, '');
};


let createProcessStructure4 = function () {
    stage0 = new ProcessStructureStage(roleID0, 0, [1], [], onlineForms, attachedFilesNames);
    stage1 = new ProcessStructureStage(roleID1, 1, [2, 3], [0], [0], onlineForms, attachedFilesNames);
    stage2 = new ProcessStructureStage(roleID2, 2, [4], [1], [1], onlineForms, attachedFilesNames);
    stage3 = new ProcessStructureStage(roleID3, 3, [5], [1], [1], onlineForms, attachedFilesNames);
    stage4 = new ProcessStructureStage(roleID4, 4, [6], [], [], onlineForms, attachedFilesNames);
    stage5 = new ProcessStructureStage(roleID5, 5, [6], [3], [3], onlineForms, attachedFilesNames);
    stage6 = new ProcessStructureStage(roleID6, 6, [], [4, 5], [4, 5], onlineForms, attachedFilesNames);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ProcessStructure(structureName, [0], stages, '');
};

describe('1.0 get initial stage by roleID', function () {

    beforeEach(createProcessStructure1);

    it('1.1 get initial stage for an existing role in an initial stage', () => {
        assert.deepEqual(1, testProcess.getInitialStageByRoleID(roleID1));
    });

    it('1.2 get initial stage for a not existing role in an initial stage', () => {
        assert.deepEqual(-1, testProcess.getInitialStageByRoleID(roleID2));
    });

    it('1.3 get initial stage for non existent roleID', () => {
        assert.deepEqual(-1, testProcess.getInitialStageByRoleID(roleID11));
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
        assert.deepEqual(true, testProcess.checkPrevNextSymmetric());
    });

    it('4.2 check if all previous are included in their next false', () => {
        createProcessStructure3();
        assert.deepEqual(false, testProcess.checkPrevNextSymmetric());
    });

    it('4.3 check if all next are included in their previous true', () => {
        createProcessStructure1();
        assert.deepEqual(true, testProcess.checkNextPrevSymmetric());
    });

    it('4.4 check if all next are included in their previous false', () => {
        createProcessStructure4();
        assert.deepEqual(false, testProcess.checkNextPrevSymmetric());
    });
});

