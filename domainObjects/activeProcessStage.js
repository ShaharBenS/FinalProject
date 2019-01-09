let processStructureStage = require("./processStructureStage");

class activeProcessStage
{

    constructor(roleID, userEmail, stageNum, nextStages, stagesToWaitFor, originStagesToWaitFor, timeApproval, onlineForms, filledOnlineForms, attachedFilesNames, comments)
    {
        this.roleID = roleID;
        this.stageNum = stageNum;
        this.nextStages = nextStages;
        this.stagesToWaitFor = stagesToWaitFor;
        this.onlineForms = onlineForms;
        this.attachedFilesNames = attachedFilesNames;
        this.userEmail = userEmail;
        this.originStagesToWaitFor = originStagesToWaitFor;
        this.timeApproval = timeApproval;
        this.filledOnlineForms = filledOnlineForms;
        this.comments = comments;
    }

    removeStagesToWaitFor(stageNum)
    {
        if (stageNum !== undefined && this.stagesToWaitFor.includes(stageNum)) {
            let index = this.stagesToWaitFor.indexOf(stageNum);
            this.stagesToWaitFor.splice(index, 1);
        } else throw new Error("invalid stage num");
    }

    handleStage(filledForms, fileNames, comments)
    {
        if (this.timeApproval === undefined && this.stagesToWaitFor.length === 0) {
            this.timeApproval = new Date();
            this.filledOnlineForms = this.filledOnlineForms.concat(filledForms);
            this.attachedFilesNames = this.attachedFilesNames.concat(fileNames);
            this.comments = comments;
        } else throw new Error();
    }

    haveNoOneToWaitFor(){
        return this.stagesToWaitFor.length === 0;
    }
}

module.exports = activeProcessStage;