
class processStructureStage {

    roleID;
    stageNum;
    nextStages;
    stagesToWaitFor;
    onlineForms;
    attachedFilesNames;

    constructor(roleID, stageNum, nextStages, stagesToWaitFor, onlineForms, attachedFilesNames) {
        this.roleID = roleID;
        this.stageNum = stageNum;
        this.nextStages = nextStages;
        this.stagesToWaitFor = stagesToWaitFor;
        this.onlineForms = onlineForms;
        this.attachedFilesNames = attachedFilesNames;
    }
}

export {processStructureStage}