
class processStructureStage {

    constructor(kind, roleID, dereg, stageNum, nextStages, stagesToWaitFor) {
        this.stageNum = stageNum;
        this.roleID = roleID;
        this.kind = kind;
        this.dereg = dereg;
        this.nextStages = nextStages;
        this.stagesToWaitFor = stagesToWaitFor;
    }
}

module.exports = processStructureStage;