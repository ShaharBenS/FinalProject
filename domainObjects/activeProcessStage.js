class activeProcessStage
{
    roleID;
    userEmail;
    stageNum;
    nextStages;
    stagesToWaitFor;
    originStagesToWaitFor;
    timeApproval;
    onlineForms;
    filledOnlineForms;
    attachedFilesNames;
    comments;

    constructor(roleID, userEmail, stageNum, nextStages, stagesToWaitFor, originStagesToWaitFor, timeApproval, onlineForms, filledOnlineForms, attachedFilesNames, comments)
    {
        this.roleID = roleID;
        this.userEmail = userEmail;
        this.stageNum = stageNum;
        this.nextStages = nextStages;
        this.stagesToWaitFor = stagesToWaitFor;
        this.originStagesToWaitFor = originStagesToWaitFor;
        this.timeApproval = timeApproval;
        this.onlineForms = onlineForms;
        this.filledOnlineForms = filledOnlineForms;
        this.attachedFilesNames = attachedFilesNames;
        this.comments = comments;
    }

    removeStagesToWaitFor(stageNum)
    {
        if (stageNum !== undefined && this.stagesToWaitFor.includes(stageNum)) {
            let index = this.stagesToWaitFor.indexOf(stageNum);
            this.stagesToWaitFor.splice(index, 1);
        }
        else return new Error("invalid stage num");
    }

    handleStage(stageNum, filledForms, fileNames, comments)
    {
        if (this.stageNum === stageNum && this.timeApproval === undefined) {
            this.timeApproval = new Date();
            this.filledOnlineForms = this.filledOnlineForms.concat(filledForms);
            this.attachedFilesNames = this.attachedFilesNames.concat(fileNames);
            this.comments = comments;
        }
        else return new Error();
    }

}