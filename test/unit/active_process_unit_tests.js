let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let expect = require('chai').expect;
let ActiveProcess = require('../../domainObjects/activeProcess');
let ActiveProcessStage = require('../../domainObjects/activeProcessStage');


const processName1 = "proc name 1";
const creationTime = new Date();
const notificationTime = 10;
const currentStages = [0];
const initials = [0, 1];

let testProcess;

const onlineForms = [];
const onlineFormsUpdated = ['file1'];
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
    stage0 = new ActiveProcessStage({roleID: roleID, stageNum: 0, nextStages: [1], stagesToWaitFor: [], originStagesToWaitFor: [], onlineForms: onlineForms, attachedFilesNames: attachedFilesNames, userEmail: 'a@bgu.ac.il', approvalTime: null, filledOnlineForms:filledOnlineForms, comments:comments});
    stage1 = new ActiveProcessStage({roleID: roleID, stageNum: 1, nextStages: [2,3], stagesToWaitFor: [0], originStagesToWaitFor: [0], onlineForms: onlineForms, attachedFilesNames: attachedFilesNames, userEmail: 'b@bgu.ac.il', approvalTime: null, filledOnlineForms:filledOnlineForms, comments:comments});
    stage2 = new ActiveProcessStage({roleID: roleID, stageNum: 2, nextStages: [4], stagesToWaitFor: [1], originStagesToWaitFor: [1], onlineForms: onlineForms, attachedFilesNames: attachedFilesNames, userEmail: 'c@bgu.ac.il', approvalTime: null, filledOnlineForms:filledOnlineForms, comments:comments});
    stage3 = new ActiveProcessStage({roleID: roleID, stageNum: 3, nextStages: [5], stagesToWaitFor: [1], originStagesToWaitFor: [1], onlineForms: onlineForms, attachedFilesNames: attachedFilesNames, userEmail: 'd@bgu.ac.il', approvalTime: null, filledOnlineForms:filledOnlineForms, comments:comments});
    stage4 = new ActiveProcessStage({roleID: roleID, stageNum: 4, nextStages: [6], stagesToWaitFor: [2], originStagesToWaitFor: [2], onlineForms: onlineForms, attachedFilesNames: attachedFilesNames, userEmail: 'e@bgu.ac.il', approvalTime: null, filledOnlineForms:filledOnlineForms, comments:comments});
    stage5 = new ActiveProcessStage({roleID: roleID, stageNum: 5, nextStages: [6], stagesToWaitFor: [3], originStagesToWaitFor: [3], onlineForms: onlineForms, attachedFilesNames: attachedFilesNames, userEmail: null, approvalTime: null, filledOnlineForms:filledOnlineForms, comments:comments});
    stage6 = new ActiveProcessStage({roleID: roleID, stageNum: 6, nextStages: [], stagesToWaitFor: [0], originStagesToWaitFor: [0], onlineForms: onlineForms, attachedFilesNames: attachedFilesNames, userEmail: null, approvalTime: null, filledOnlineForms:filledOnlineForms, comments:comments});
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ActiveProcess({processName: processName1, creatorRoleID: roleID, processDate: new Date(), processUrgency:3, creationTime:creationTime, notificationTime: notificationTime, currentStages: currentStages.slice(), initials: initials, stages: stages});
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

    it('1.3 checks for non existing stage in stages', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.addCurrentStage(999)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
    });

    it('1.4 checks for undefined value', () => {
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
        assert.deepEqual(creationTime, testProcess.creationTime);
    });

    it('3.2 define time again', () => {
        expect(() => {
            testProcess.creationTime = new Date();
        }).to.throw();
        assert.deepEqual(creationTime, testProcess.creationTime);
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

    it('5.1 get existing paths', () => {
        assert.deepEqual([0, 1, 2, 3, 4, 5, 6], testProcess.getCoverage([0]).sort());
        assert.deepEqual([1, 2, 3, 4, 5, 6], testProcess.getCoverage([1]).sort());
        assert.deepEqual([2, 4, 6], testProcess.getCoverage([2]).sort());
        assert.deepEqual([3, 5, 6], testProcess.getCoverage([3]).sort());
        assert.deepEqual([4, 6], testProcess.getCoverage([4]).sort());
        assert.deepEqual([5, 6], testProcess.getCoverage([5]).sort());
        assert.deepEqual([6], testProcess.getCoverage([6]).sort());
    });

    it('5.2 get path from not existing stage num', () => {
        expect(() => {
            testProcess.getCoverage([-1])
        }).to.throw();
        expect(() => {
            testProcess.getCoverage([7])
        }).to.throw();
        expect(() => {
            testProcess.getCoverage([1.5])
        }).to.throw();
        expect(() => {
            testProcess.getCoverage(["a"])
        }).to.throw();
    });
});

describe('6.0 advance process', function () {

    beforeEach(createActiveProcess1);

    it('6.1 advances 1 step', () => {
        assert.deepEqual([0], testProcess.currentStages);
        testProcess.handleStage({stageNum: 0, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(0,[1]);
        assert.deepEqual([1], testProcess.currentStages);
        assert.equal(testProcess.stages.length, 7);
    });

    it('6.2 advances 2 steps', () => {
        assert.deepEqual([0], testProcess.currentStages);
        testProcess.handleStage({stageNum: 0, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(0,[1]);
        testProcess.handleStage({stageNum: 1, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(1,[2, 3]);
        assert.deepEqual([2, 3], testProcess.currentStages);
        assert.equal(testProcess.stages.length, 7);
    });

    it('6.3 advances 2 steps with selection of 1 path', () => {
        assert.deepEqual([0], testProcess.currentStages);
        testProcess.handleStage({stageNum: 0, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(0,[1]);
        testProcess.handleStage({stageNum: 1, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(1,[2]);
        assert.deepEqual([2], testProcess.currentStages);
        assert.equal(testProcess.stages.length, 7);
    });
});

describe('7.0 check if process is waiting for the user', function () {

    beforeEach(createActiveProcess1);

    it('7.1 check if process is waiting for the user when user exists in a current stage', () => {
        assert.equal(testProcess.isWaitingForUser(4,'e@bgu.ac.il'), true);
    });

    it('7.2 check if process is waiting for the user when step has no user assigned', () => {
        assert.equal(testProcess.isWaitingForUser(5,''), true);
    });

    it('7.3 check if process is waiting for the user when role doesnt exist in stages', () => {
        assert.equal(testProcess.isWaitingForUser(11,''), false);
    });

    it('7.4 check if process is waiting for the user when role doesnt exist in a current stage', () => {
        assert.equal(testProcess.isWaitingForUser(3,''), false);
    });
});

describe('8.0 check if user participates in process', function () {

    beforeEach(createActiveProcess1);

    it('8.1 check if user participates in process true', () => {
        assert.equal(testProcess.isParticipatingInProcess('e@bgu.ac.il'), true);
    });

    it('8.2 check if user participates in process true', () => {
        assert.equal(testProcess.isParticipatingInProcess('doesntparticipate@bgu.ac.il'), false);
    });
});

describe('9.0 update stage', function () {

    beforeEach(createActiveProcess1);

    it('9.1  add online form to stage', () => {
        testProcess.attachOnlineFormToStage(2, onlineFormsUpdated[0]);
        assert.equal(1, testProcess.stages[2].onlineForms.length);
        assert.equal(onlineFormsUpdated[0], testProcess.stages[2].onlineForms[0]);
    });
});