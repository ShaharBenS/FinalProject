class activeProcessStage {

    constructor(pureObject)
    {
        this.roleID = pureObject.roleID;
        this.stageNum = pureObject.stageNum;
        this.nextStages = pureObject.nextStages;
        this.stagesToWaitFor = pureObject.stagesToWaitFor;
        this.attachedFilesNames = pureObject.attachedFilesNames;
        this.userEmail = pureObject.userEmail;
        this.originStagesToWaitFor = pureObject.originStagesToWaitFor;
        this.approvalTime = pureObject.approvalTime;
        this.comments = pureObject.comments;
    }

    removeStagesToWaitFor(stages) {
        if(Array.isArray(stages) && !stages.some(isNaN))
        {
            this.stagesToWaitFor = this.stagesToWaitFor.filter((stage)=>!stages.includes(stage));
        }
        else
        {
            throw new Error();
        }
    }

    handleStage(fileNames, comments)
    {
        if (this.approvalTime === null && this.stagesToWaitFor.length === 0) {
            this.approvalTime = new Date();
            this.attachedFilesNames = this.attachedFilesNames.concat(fileNames);
            this.comments = comments;
        } else throw new Error();
    }

    haveNoOneToWaitFor() {
        return this.stagesToWaitFor.length === 0;
    }
}

module.exports = activeProcessStage;