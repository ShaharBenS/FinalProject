let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let ProcessStructure = require('../../domainObjects/processStructure');
let ProcessStructureStage = require('../../domainObjects/processStructureStage');
let processStructureSankey = require('../../domainObjects/processStructureSankey');
let fs = require("fs");

const structureName = "structure1";
let testProcess;
let stage0, stage1, stage2, stage3, stage4, stage5, stage6;

let roleID0 = {id: 0};
let roleID1 = {id: 1};
let roleID2 = {id: 2};
let roleID3 = {id: 3};
let roleID4 = {id: 4};
let roleID5 = {id: 5};
let roleID6 = {id: 6};

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
    stage0 = new ProcessStructureStage("ByRole", roleID0, undefined, 0, [1], []);
    stage1 = new ProcessStructureStage("ByRole", roleID1, undefined, 1, [2, 3], [0]);
    stage2 = new ProcessStructureStage("ByDereg", undefined, "1", 2, [4], [1]);
    stage3 = new ProcessStructureStage("ByDereg", undefined, "2", 3, [5], [1]);
    stage4 = new ProcessStructureStage("ByRole", roleID4, undefined, 4, [6], [2]);
    stage5 = new ProcessStructureStage("ByRole", roleID5, undefined, 5, [6], [3]);
    stage6 = new ProcessStructureStage("Creator", undefined, undefined, 6, [], [4, 5]);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ProcessStructure(structureName, stages, '', true, [], "0");
};

let createProcessStructure2 = function () {
    stage0 = new ProcessStructureStage("ByRole", roleID0, undefined, 0, [], []);
    stage1 = new ProcessStructureStage("ByRole", roleID1, undefined, 1, [2, 3], [0]);
    stage2 = new ProcessStructureStage("ByDereg", undefined, "1", 2, [4], [1]);
    stage3 = new ProcessStructureStage("ByDereg", undefined, "2", 3, [5], [1]);
    stage4 = new ProcessStructureStage("ByRole", roleID4, undefined, 2, [6], [2]);
    stage5 = new ProcessStructureStage("ByRole", roleID5, undefined, 5, [6], [3]);
    stage6 = new ProcessStructureStage("Creator", undefined, undefined, 6, [], [4, 5]);
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ProcessStructure(structureName, stages, '', true, [], "0");
};

let processStructure1 = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure1/processStructure1.json"));
let processStructure2 = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure2/processStructure2.json"));
let processStructure2_connections = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure2/processStructure2_connections.json"));
let processStructure2_stages = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure2/processStructure2_stages.json"));
let processStructure3 = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure3/processStructure3.json"));
let processStructure3_connections = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure3/processStructure3_connections.json"));
let processStructure3_stages = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure3/processStructure3_stages.json"));
let processStructure4 = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure4/processStructure4.json"));
let processStructure5 = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure5/processStructure5.json"));
let processStructure6 = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure6/processStructure6.json"));
let processStructure7 = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure7/processStructure7.json"));
let processStructure8 = JSON.parse(fs.readFileSync("./test/inputs/processStructures/processStructure8/processStructure8.json"));


describe('1.0 check for duplicate stage numbers', function () {

    it('1.1 check for duplicate stage numbers is true', () => {
        createProcessStructure1();
        assert.deepEqual(true, testProcess.checkNotDupStagesInStructure());
    });

    it('1.2 check for duplicate stage numbers is true', () => {
        createProcessStructure2();
        assert.deepEqual(false, testProcess.checkNotDupStagesInStructure());
    });
});

describe('2.0 check if all next stages contain their previous stages', function () {

    it('2.1 check if all previous are included in their next true', () => {
        createProcessStructure1();
        assert.deepEqual(true, testProcess.checkPrevNextSymmetric());
    });

    it('2.2 check if all previous are included in their next false', () => {
        createProcessStructure2();
        assert.deepEqual(false, testProcess.checkPrevNextSymmetric());
    });

    it('2.3 check if all next are included in their previous true', () => {
        createProcessStructure1();
        assert.deepEqual(true, testProcess.checkNextPrevSymmetric());
    });

    it('2.4 check if all next are included in their previous false', () => {
        createProcessStructure2();
        assert.deepEqual(false, testProcess.checkNextPrevSymmetric());
    });
});

describe('3.0 check get stage by stage num', function () {

    it('3.1 check get stage by stage num', () => {
        createProcessStructure1();
        assert.deepEqual(stage0, testProcess.getStageByStageNum(0));
    });

    it('3.2 check get stage by stage num', () => {
        createProcessStructure1();
        assert.deepEqual(stage3, testProcess.getStageByStageNum(3));
    });
});


describe('4.0 sankey tests', function () {

    it('4.1.1 check getSankeyStages', () => {
        assert.deepEqual(new processStructureSankey(processStructure1).getSankeyStages(), []);
    });

    it('4.1.2 check getSankeyStages', () => {
        assert.deepEqual(new processStructureSankey(processStructure2).getSankeyStages(), processStructure2_stages);
    });

    it('4.1.3 check getSankeyStages', () => {
        assert.deepEqual(new processStructureSankey(processStructure3).getSankeyStages(), processStructure3_stages);
    });

    it('4.2.1 check getStages', () => {
        assert.deepEqual(new processStructureSankey(processStructure1).getStages((x) => x), []);
    });

    it('4.2.2 check getStages', () => {
        let roleNameToId = {
            "AA": "1",
            "BB": "2"
        };
        assert.deepEqual(new processStructureSankey(processStructure2).getStages((x) => roleNameToId[x]), [
            {
                kind: "ByRole",
                roleID: "1",
                dereg: undefined,
                aboveCreatorNumber: -1,
                stageNum: 0,
                nextStages: [1],
                stagesToWaitFor: [],
            },
            {
                kind: "ByRole",
                roleID: "2",
                dereg: undefined,
                aboveCreatorNumber: -1,
                stageNum: 1,
                nextStages: [],
                stagesToWaitFor: [0],
            }
        ]);
    });

    it('4.2.3 check getStages', () => {
        let roleNameToId = {
            "AA": "1",
            "BB": "2"
        };
        assert.deepEqual(new processStructureSankey(processStructure3).getStages((x) => roleNameToId[x]), [
            {
                kind: "ByRole",
                roleID: "1",
                dereg: undefined,
                aboveCreatorNumber: -1,
                stageNum: 0,
                nextStages: [1],
                stagesToWaitFor: [],
            },
            {
                kind: "ByDereg",
                roleID: undefined,
                dereg: "2",
                aboveCreatorNumber: -1,
                stageNum: 1,
                nextStages: [3],
                stagesToWaitFor: [0],
            },
            {
                kind: "Creator",
                roleID: undefined,
                dereg: undefined,
                aboveCreatorNumber: -1,
                stageNum: 2,
                nextStages: [],
                stagesToWaitFor: [3],
            },
            {
                kind: "ByRole",
                roleID: "2",
                dereg: undefined,
                aboveCreatorNumber: -1,
                stageNum: 3,
                nextStages: [2],
                stagesToWaitFor: [1],
            }
        ]);
    });

    it('4.3.1 check getConnections', () => {
        assert.deepEqual(new processStructureSankey(processStructure1).getConnections(), []);
    });

    it('4.3.2 check getConnections', () => {
        assert.deepEqual(new processStructureSankey(processStructure2).getConnections(), processStructure2_connections);
    });

    it('4.3.3 check getConnections', () => {
        assert.deepEqual(new processStructureSankey(processStructure3).getConnections(), processStructure3_connections);
    });

    it('4.4.1 check hasMoreThanOneFlow', () => {
        assert.deepEqual(new processStructureSankey(processStructure3).hasMoreThanOneFlow(), false);
    });

    it('4.4.2 check hasMoreThanOneFlow', () => {
        assert.deepEqual(new processStructureSankey(processStructure4).hasMoreThanOneFlow(), false);
    });

    it('4.4.3 check hasMoreThanOneFlow', () => {
        assert.deepEqual(new processStructureSankey(processStructure5).hasMoreThanOneFlow(), true);
    });

    it('4.4.4 check hasMoreThanOneFlow', () => {
        assert.deepEqual(new processStructureSankey(processStructure7).hasMoreThanOneFlow(), false);
    });

    it('4.4.5 check hasMoreThanOneFlow', () => {
        assert.deepEqual(new processStructureSankey(processStructure6).hasMoreThanOneFlow(), false);
    });

    it('4.5.1 check hasMultipleConnections', () => {
        assert.deepEqual(new processStructureSankey(processStructure4).hasMultipleConnections(), false);
    });

    it('4.5.2 check hasMultipleConnections', () => {
        assert.deepEqual(new processStructureSankey(processStructure7).hasMultipleConnections(), false);
    });

    it('4.5.3 check hasMultipleConnections', () => {
        assert.deepEqual(new processStructureSankey(processStructure8).hasMultipleConnections(), true);
    });

    it('4.6.1 check hasCycles', () => {
        assert.deepEqual(new processStructureSankey(processStructure7).hasCycles(), false);
    });

    it('4.6.2 check hasCycles', () => {
        assert.deepEqual(new processStructureSankey(processStructure6).hasCycles(), true);
    });

    it('4.6.3 check hasCycles', () => {
        assert.deepEqual(new processStructureSankey(processStructure2).hasCycles(), false);
    });

    it('4.7.1 check hasNoStages', () => {
        assert.deepEqual(new processStructureSankey(processStructure1).hasNoStages(), true);
    });

    it('4.7.2 check hasNoStages', () => {
        assert.deepEqual(new processStructureSankey(processStructure2).hasNoStages(), false);
    });
});

describe('5.0 check get stage by stage num', function () {

    it('5.1 check get stage by stage num', () => {
        createProcessStructure1();
        assert.deepEqual(0, testProcess.getInitialStageByRoleID({id:{equals:(x)=>x===0}},"2"));
    });

    it('5.2 check get stage by stage num', () => {
        createProcessStructure1();
        assert.deepEqual(1, testProcess.getInitialStageByRoleID({id:{equals:(x)=>x===1}},"1"));
    });

    it('5.3 check get stage by stage num', () => {
        createProcessStructure1();
        assert.deepEqual(2, testProcess.getInitialStageByRoleID({id:{equals:(x)=>x===4}},"1"));
    });

    it('5.4 check get stage by stage num', () => {
        createProcessStructure1();
        assert.deepEqual(2, testProcess.getInitialStageByRoleID({id:{equals:(x)=>x===5}},"1"));
    });

    it('5.5 check get stage by stage num', () => {
        createProcessStructure1();
        assert.deepEqual(-1, testProcess.getInitialStageByRoleID({id:{equals:(x)=>x===3}},"3"));
    });
});
