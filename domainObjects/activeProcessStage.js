class activeProcessStage {

    constructor(pureObject)
    {
        this.roleID = pureObject.roleID;
        this.kind = pureObject.kind;
        this.dereg = pureObject.dereg;
        this.stageNum = pureObject.stageNum;
        this.nextStages = pureObject.nextStages;
        this.stagesToWaitFor = pureObject.stagesToWaitFor;
        this.userEmail = pureObject.userEmail;
        this.originStagesToWaitFor = pureObject.originStagesToWaitFor;
        this.assignmentTime = pureObject.assignmentTime;
        this.approvalTime = pureObject.approvalTime;
        this.notificationsCycle = pureObject.notificationsCycle;
    }

    removeStagesToWaitForIncludingOrigin(stages) {
        if(Array.isArray(stages) && !stages.some(isNaN))
        {
            this.stagesToWaitFor = this.stagesToWaitFor.filter((stage)=>!stages.includes(stage));
            this.originStagesToWaitFor = this.stagesToWaitFor.slice();
        }
        else
        {
            throw new Error();
        }
    }

    addStagesToWaitForIncludingOrigin(stages) {
        if(Array.isArray(stages) && !stages.some(isNaN))
        {
            stages.forEach(stage=>{
                if(!this.stagesToWaitFor.includes(stage))
                    this.stagesToWaitFor.push(stage);
            });
            this.originStagesToWaitFor = this.stagesToWaitFor.slice();
        }
        else
        {
            throw new Error();
        }
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

    addStagesToWaitFor(stages) {
        if(Array.isArray(stages) && !stages.some(isNaN))
        {
            stages.forEach(stage=>{
               if(!this.stagesToWaitFor.includes(stage))
                   this.stagesToWaitFor.push(stage);
            });
        }
        else
        {
            throw new Error();
        }
    }

    removeNextStages(stages) {
        if(Array.isArray(stages) && !stages.some(isNaN))
        {
            this.nextStages = this.nextStages.filter((stage)=>!stages.includes(stage));
        }
        else
        {
            throw new Error();
        }
    }

    addNextStages(stages) {
        if(Array.isArray(stages) && !stages.some(isNaN))
        {
            stages.forEach(stage=>{
                if(!this.nextStages.includes(stage))
                    this.nextStages.push(stage);
            });
        }
        else
        {
            throw new Error();
        }
    }

    handleStage()
    {
        if (this.approvalTime === null && this.stagesToWaitFor.length === 0) {
            this.approvalTime = new Date();
        } else throw new Error();
    }

    haveNoOneToWaitFor() {
        return this.stagesToWaitFor.length === 0;
    }

}

module.exports = activeProcessStage;