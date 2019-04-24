let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let expect = require('chai').expect;
let ActiveProcess = require('../../domainObjects/activeProcess');
let ActiveProcessStage = require('../../domainObjects/activeProcessStage');

const processName1 = "proc name 1";
let today = new Date();
const creationTime = new Date();
const notificationTime = 10;

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
           +---+
           | 1 |
           +-+-+
             |
             v
           +---+
           | 2 |
           +-+-+
             |
             v
           +-+-+
      +----+ 3 +----+
      |    +---+    |
      |             |
    +-v-+         +-v-+
    | 4 |         | 5 |
    +-+-+         +-+-+
      |             |
      |    +---+    |
      +----> 6 <----+
           +---+
    */
    stage0 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'ByDereg', dereg: '2', stageNum: 0, nextStages: [1], stagesToWaitFor: [], attachedFilesNames: attachedFilesNames, userEmail: 'a@bgu.ac.il', assignmentTime: today, approvalTime: null, notificationsCycle:1, comments:comments});
    stage1 = new ActiveProcessStage({roleID: {id : Buffer.from('2')}, kind: 'ByDereg', dereg: '3', stageNum: 1, nextStages: [2], stagesToWaitFor: [0], attachedFilesNames: attachedFilesNames, userEmail: 'b@bgu.ac.il', assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    stage2 = new ActiveProcessStage({roleID: {id : Buffer.from('3')}, kind: 'ByRole', dereg: '', stageNum: 2, nextStages: [3], stagesToWaitFor: [1], attachedFilesNames: attachedFilesNames, userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    stage3 = new ActiveProcessStage({roleID: {id : Buffer.from('2')}, kind: 'ByDereg', dereg: '3', stageNum: 3, nextStages: [4,5], stagesToWaitFor: [2], attachedFilesNames: attachedFilesNames, userEmail: 'b@bgu.ac.il', assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    stage4 = new ActiveProcessStage({roleID: {id : Buffer.from('4')}, kind: 'ByRole', dereg: '', stageNum: 4, nextStages: [6], stagesToWaitFor: [3], attachedFilesNames: attachedFilesNames, userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    stage5 = new ActiveProcessStage({roleID: {id : Buffer.from('5')}, kind: 'ByRole', dereg: '', stageNum: 5, nextStages: [6], stagesToWaitFor: [3], attachedFilesNames: attachedFilesNames, userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    stage6 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'Creator', dereg: '', stageNum: 6, nextStages: [], stagesToWaitFor: [4,5], attachedFilesNames: attachedFilesNames, userEmail: 'a@bgu.ac.il', assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ActiveProcess({processName: processName1, creatorUserEmail: 'a@bgu.ac.il', processDate: new Date(), processUrgency: 3, creationTime: creationTime, notificationTime: notificationTime, currentStages: [0], onlineForms: onlineForms, filledOnlineForms: filledOnlineForms, lastApproached: new Date(), stageToReturnTo: stage0.stageNum}, stages);
};

let createActiveProcess2 = function () {

    /*
           +---+
           | 0 |
           +-+-+
             |
             v
           +---+
           | 1 |
           +-+-+
             |
             v
           +---+
           | 2 |
           +-+-+
             |
             v
           +-+-+
      +----+ 3 +----+
      |    +---+    |
      |             |
    +-v-+         +-v-+
    | 4 |         | 5 |
    +-+-+         +-+-+
      |             |
      |    +---+    |
      +----> 6 <----+
           +---+
    */
    stage0 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'ByDereg', dereg: '2', stageNum: 0, nextStages: [1], stagesToWaitFor: [], attachedFilesNames: attachedFilesNames, userEmail: 'a@bgu.ac.il', assignmentTime:today, approvalTime: today, notificationsCycle:1, comments:comments});
    stage1 = new ActiveProcessStage({roleID: {id : Buffer.from('2')}, kind: 'ByDereg', dereg: '3', stageNum: 1, nextStages: [2], stagesToWaitFor: [], attachedFilesNames: attachedFilesNames, userEmail: 'b@bgu.ac.il', assignmentTime:today, approvalTime: today, notificationsCycle:1, comments:comments});
    stage2 = new ActiveProcessStage({roleID: {id : Buffer.from('3')}, kind: 'ByRole', dereg: '', stageNum: 2, nextStages: [3], stagesToWaitFor: [], attachedFilesNames: attachedFilesNames, userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    stage3 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'Creator', dereg: '', stageNum: 3, nextStages: [4,5], stagesToWaitFor: [2], attachedFilesNames: attachedFilesNames, userEmail: 'a@bgu.ac.il', assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    stage4 = new ActiveProcessStage({roleID: {id : Buffer.from('4')}, kind: 'ByRole', dereg: '', stageNum: 4, nextStages: [6], stagesToWaitFor: [3], attachedFilesNames: attachedFilesNames, userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    stage5 = new ActiveProcessStage({roleID: {id : Buffer.from('5')}, kind: 'ByRole', dereg: '', stageNum: 5, nextStages: [6], stagesToWaitFor: [3], attachedFilesNames: attachedFilesNames, userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    stage6 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'Creator', dereg: '', stageNum: 6, nextStages: [], stagesToWaitFor: [4,5], attachedFilesNames: attachedFilesNames, userEmail: 'a@bgu.ac.il', assignmentTime:null, approvalTime: null, notificationsCycle:1, comments:comments});
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ActiveProcess({processName: processName1, creatorUserEmail: 'a@bgu.ac.il', processDate: new Date(), processUrgency: 3, creationTime: creationTime, notificationTime: notificationTime, currentStages: [2], onlineForms: onlineForms, filledOnlineForms: filledOnlineForms, lastApproached: new Date(), stageToReturnTo: stage0.stageNum}, stages);
};

describe('1.0 remove stage', function () {

    beforeEach(createActiveProcess1);

    it('1.1 remove existing stage', () => {
        testProcess.getStageByStageNum(1);
        assert.deepEqual(testProcess.getStageByStageNum(0).nextStages, [1]);
        assert.deepEqual(testProcess.getStageByStageNum(2).stagesToWaitFor, [1]);
        testProcess.removeStage(1);
        expect(() => testProcess.getStageByStageNum(1)).to.throw();
        assert.deepEqual(testProcess.getStageByStageNum(0).nextStages, [2]);
        assert.deepEqual(testProcess.getStageByStageNum(2).stagesToWaitFor, [0]);
    });

    it('1.2 remove non existing stage', () => {
        expect(() => testProcess.getStageByStageNum(999)).to.throw();
        expect(() => testProcess.removeStage(999)).to.throw();
    });

    it('1.3 remove non numeric stage', () => {
        expect(() => testProcess.getStageByStageNum('blah')).to.throw();
        expect(() => testProcess.removeStage('blah')).to.throw();
    });
});

describe('2.0 add current stage', function () {

    beforeEach(createActiveProcess1);

    it('2.1 add non existing current stage', () => {
        assert.deepEqual([0], testProcess.currentStages);
        testProcess.addCurrentStage(1);
        assert.deepEqual([0, 1], testProcess.currentStages);
    });

    it('2.2 add existing current stage', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.addCurrentStage(0)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
    });

    it('2.3 add non existing stage to current stages', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.addCurrentStage(999)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
    });

    it('2.4 add non numeric stage to current stages', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.addCurrentStage(undefined)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
    });
});

describe('3.0 remove current stage', function () {

    beforeEach(createActiveProcess1);

    it('3.1 remove existing stage', () => {
        assert.deepEqual([0], testProcess.currentStages);
        testProcess.removeCurrentStage(0);
        assert.deepEqual([], testProcess.currentStages);
    });

    it('3.2 remove non existing stage', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.removeCurrentStage(1)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
    });

    it('3.3 remove non existing stage from current stages', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.removeCurrentStage(999)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
    });

    it('3.4 remove non numeric stage to current stages', () => {
        assert.deepEqual([0], testProcess.currentStages);
        expect(() => testProcess.removeCurrentStage(undefined)).to.throw();
        assert.deepEqual([0], testProcess.currentStages);
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
        assert.deepEqual([2, 3, 4, 5, 6], testProcess.getCoverage([2]).sort());
        assert.deepEqual([3, 4, 5, 6], testProcess.getCoverage([3]).sort());
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
        testProcess.handleStage({stageNum: 0, fileNames: [], comments: ""});
        testProcess.advanceProcess(0,[1]);
        assert.deepEqual([1], testProcess.currentStages);
        assert.equal(testProcess.stages.length, 7);
    });

    it('6.2 advances 2 steps', () => {
        assert.deepEqual([0], testProcess.currentStages);
        testProcess.handleStage({stageNum: 0, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(0,[1]);
        testProcess.handleStage({stageNum: 1, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(1,[2]);
        assert.deepEqual([2], testProcess.currentStages);
        assert.equal(testProcess.stages.length, 7);
    });

    it('6.3 advances 4 steps with selection of 1 path', () => {
        assert.deepEqual([0], testProcess.currentStages);
        testProcess.handleStage({stageNum: 0, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(0,[1]);
        testProcess.handleStage({stageNum: 1, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(1,[2]);
        testProcess.handleStage({stageNum: 2, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(2,[3]);
        testProcess.handleStage({stageNum: 3, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(3,[4]);
        assert.deepEqual([4], testProcess.currentStages);
        assert.equal(testProcess.stages.length, 7);
    });

    it('6.3 advances 4 steps with selection of 2 paths', () => {
        assert.deepEqual([0], testProcess.currentStages);
        testProcess.handleStage({stageNum: 0, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(0,[1]);
        testProcess.handleStage({stageNum: 1, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(1,[2]);
        testProcess.handleStage({stageNum: 2, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(2,[3]);
        testProcess.handleStage({stageNum: 3, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(3,[4, 5]);
        assert.deepEqual([4, 5], testProcess.currentStages);
        assert.equal(testProcess.stages.length, 7);
    });
});

describe('7.0 check if process is waiting for the user', function () {

    beforeEach(createActiveProcess1);

    it('7.1 check if process is waiting for the user when user exists in a current stage', () => {
        assert.equal(testProcess.isWaitingForUser('a@bgu.ac.il'), true);
    });

    it('7.2 check if process is waiting for the user when user doesnt exist in a current stage', () => {
        assert.equal(testProcess.isWaitingForUser('b@bgu.ac.il'), false);
    });
});

describe('8.0 check if process is available to role', function () {

    beforeEach(createActiveProcess2);

    it('8.1 check if process is available to role true', () => {
        assert.equal(testProcess.isAvailableForRole({id : Buffer.from('3')}), true);
    });

    it('8.2 check if process is available to role false', () => {
        assert.equal(testProcess.isParticipatingInProcess({id : Buffer.from('1')}), false);
    });

    it('8.3 check if process is available to non existent role', () => {
        assert.equal(testProcess.isParticipatingInProcess({id : Buffer.from('100')}), false);
    });
});

describe('9.0 check if user participates in process', function () {

    beforeEach(createActiveProcess1);

    it('9.1 check if user participates in process true', () => {
        assert.equal(testProcess.isParticipatingInProcess('a@bgu.ac.il'), true);
    });

    it('9.2 check if user participates in process false', () => {
        assert.equal(testProcess.isParticipatingInProcess('doesntparticipate@bgu.ac.il'), false);
    });
});

describe('10.0 return process to creator', function () {

    beforeEach(createActiveProcess2);

    it('10.1  return process to creator', () => {
        testProcess.handleStage({stageNum: 2, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(2,[3]);
        testProcess.handleStage({stageNum: 3, filledForms:[], fileNames: [], comments: ""});
        testProcess.advanceProcess(3,[4]);
        testProcess.assignUserToStage({id : Buffer.from('4')},'c@bgu.ac.il');
        testProcess.returnProcessToCreator();
        assert.deepEqual(testProcess.currentStages,[3]);
        assert.deepEqual(testProcess.creatorUserEmail, testProcess.getStageByStageNum(3).userEmail);
        assert.deepEqual(testProcess.getStageByStageNum(4).stagesToWaitFor, testProcess.getStageByStageNum(4).originStagesToWaitFor);
    });
});

describe('11.0 assign user and get current stage for user', function () {

    beforeEach(createActiveProcess1);

    it('11.1 assign user and get current stage for user true', () => {
        let stage = testProcess.getStageByStageNum(5);
        assert.equal(stage.userEmail,null);
        assert.equal(testProcess.assignUserToStage({id : Buffer.from('6')},'c@post.bgu.ac.il'),true);
        assert.equal(testProcess.getCurrentStageNumberForUser('c@post.bgu.ac.il'),5);
        stage = testProcess.getStageByStageNum(5);
        assert.equal(stage.userEmail,'c@post.bgu.ac.il');
    });

    it('11.2 assign user and get current stage for user false', () => {
        let stage = testProcess.getStageByStageNum(6);
        assert.equal(stage.userEmail,null);
        expect(() => {
            assert.equal(testProcess.assignUserToStage({id : Buffer.from('7')},'c@post.bgu.ac.il'),false);
        }).to.throw();
        stage = testProcess.getStageByStageNum(6);
        assert.equal(stage.userEmail,null);
    });

});

describe('12.0 assign user and unassign user', function () {

    beforeEach(createActiveProcess1);

    it('12.1 assign user and unassign user true', () => {
        let stage = testProcess.getStageByStageNum(5);
        assert.equal(stage.userEmail,null);
        assert.equal(testProcess.assignUserToStage({id : Buffer.from('6')},'c@post.bgu.ac.il'),true);
        stage = testProcess.getStageByStageNum(5);
        assert.equal(stage.userEmail,'c@post.bgu.ac.il');
        assert.equal(testProcess.unAssignUserToStage({id : Buffer.from('6')},'c@post.bgu.ac.il'),true);
        stage = testProcess.getStageByStageNum(5);
        assert.equal(stage.userEmail,null);
    });

    it('12.2 assign user and unassign user false', () => {
        let stage = testProcess.getStageByStageNum(6);
        assert.equal(stage.userEmail,null);
        expect(() => {
            assert.equal(testProcess.unAssignUserToStage({id : Buffer.from('7')},'c@post.bgu.ac.il'),false);
        }).to.throw();
        stage = testProcess.getStageByStageNum(6);
        assert.equal(stage.userEmail,null);
    });

});

describe('13.0 get participating users', function () {
    beforeEach(createActiveProcess1);
    it('13.1 get participating users', () => {
        assert.deepEqual(testProcess.getParticipatingUsers(),['a@bgu.ac.il','b@bgu.ac.il','c@bgu.ac.il','d@bgu.ac.il','e@bgu.ac.il']);
    });
});