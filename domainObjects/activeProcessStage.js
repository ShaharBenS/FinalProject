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
            return new Error('removeStagesToWaitForIncludingOrigin: stages are invalid');
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
            return new Error('addStagesToWaitForIncludingOrigin: stages are invalid');
        }
    }

    removeStagesToWaitFor(stages) {
        if(Array.isArray(stages) && !stages.some(isNaN))
        {
            this.stagesToWaitFor = this.stagesToWaitFor.filter((stage)=>!stages.includes(stage));
        }
        else
        {
            return new Error('removeStagesToWaitFor: stages are invalid');
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
            return new Error('addStagesToWaitFor: stages are invalid');
        }
    }

    removeNextStages(stages) {
        if(Array.isArray(stages) && !stages.some(isNaN))
        {
            this.nextStages = this.nextStages.filter((stage)=>!stages.includes(stage));
        }
        else
        {
            return new Error('removeNextStages: stages are invalid');
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
            throw new Error('addNextStages: stages are invalid');
        }
    }

    handleStage()
    {
        if (this.approvalTime === null && this.stagesToWaitFor.length === 0) {
            this.approvalTime = new Date();
        } else return new Error('handleStage: stage already handled or is waiting for stages')
    }

    haveNoOneToWaitFor() {
        return this.stagesToWaitFor.length === 0;
    }

}

module.exports = activeProcessStage;