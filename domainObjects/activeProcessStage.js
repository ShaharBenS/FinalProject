class activeProcessStage {

    constructor(pureObject)
    {
        this.role = pureObject.role;
        this.stageNum = pureObject.stageNum;
        this.nextStages = pureObject.nextStages;
        this.stagesToWaitFor = pureObject.stagesToWaitFor;
        this.onlineForms = pureObject.onlineForms;
        this.attachedFilesNames = pureObject.attachedFilesNames;
        this.user = pureObject.user;
        this.originStagesToWaitFor = pureObject.originStagesToWaitFor;
        this.approvalTime = pureObject.approvalTime;
        this.filledOnlineForms = pureObject.filledOnlineForms;
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

    handleStage(filledForms, fileNames, comments)
    {
        if (this.approvalTime === null && this.stagesToWaitFor.length === 0) {
            this.approvalTime = new Date();
            this.filledOnlineForms = this.filledOnlineForms.concat(filledForms);
            this.attachedFilesNames = this.attachedFilesNames.concat(fileNames);
            this.comments = comments;
        } else throw new Error();
    }

    haveNoOneToWaitFor() {
        return this.stagesToWaitFor.length === 0;
    }

    attachOnlineForm(formName) {
        let alreadyExist = false;
        this.onlineForms.every((formName2) => {
            if (formName === formName2) {
                alreadyExist = true;
                return false;
            }
            return true;
        });
        if (!alreadyExist) {
            this.onlineForms = this.onlineForms.concat([formName]);
        }
    }
}

module.exports = activeProcessStage;