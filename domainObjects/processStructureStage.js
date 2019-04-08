
class processStructureStage {

    constructor(roleID, stageNum, nextStages, stagesToWaitFor, attachedFilesNames) {
        this.roleID = roleID;
        this.stageNum = stageNum;
        this.nextStages = nextStages;
        this.stagesToWaitFor = stagesToWaitFor;
        this.attachedFilesNames = attachedFilesNames;
    }
}

module.exports = processStructureStage;