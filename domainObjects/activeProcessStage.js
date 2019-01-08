let processStructureStage = require("./activeProcessStage");

class activeProcessStage extends  processStructureStage
{
    userEmail;
    originStagesToWaitFor;
    timeApproval;
    filledOnlineForms;
    comments;

    constructor(roleID, userEmail, stageNum, nextStages, stagesToWaitFor, originStagesToWaitFor, timeApproval, onlineForms, filledOnlineForms, attachedFilesNames, comments)
    {
        super(roleID, stageNum, nextStages, stagesToWaitFor, onlineForms, attachedFilesNames);
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

    haveNoOneToWaitFor(){
        return this.stagesToWaitFor.length() === 0;
    }


}