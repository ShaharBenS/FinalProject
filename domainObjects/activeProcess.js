class activeProcess {

    constructor(processObject,stages) {
        this.processName = processObject.processName;
        this.creatorUserEmail = processObject.creatorUserEmail;
        this.processDate = processObject.processDate;
        this.processUrgency = processObject.processUrgency;
        this.creationTime = processObject.creationTime;
        this.notificationTime = processObject.notificationTime;
        this.currentStages = processObject.currentStages;
        this.onlineForms = processObject.onlineForms;
        this.filledOnlineForms = processObject.filledOnlineForms;
        this.stages = stages;
        this.lastApproached = processObject.lastApproached;
    }

    removeStage(stageToRemove){
        if(Number.isInteger(stageToRemove))
        {
            for(let i=0;i<this.stages.length;i++)
            {
                if(this.stages[i].stageNum === stageToRemove)
                {
                    this.stages.splice(i,1);
                    return;
                }
            }
        }
        else {
            throw new Error('stage isnt numeric');
        }

    }

    addCurrentStage(stageNum) {
        if(!this.isStageExists(stageNum))
        {
            throw new Error('stage doesnt exist');
        }
        if(Number.isInteger(stageNum) && !this.currentStages.includes(stageNum))
        {
            this.currentStages.push(stageNum);
        }
        else
        {
            throw new Error("invalid stage number");
        }
    }

    removeCurrentStage(stageNum) {
        if(!this.isStageExists(stageNum))
        {
            throw new Error('stage doesnt exist');
        }
        if(Number.isInteger(stageNum) && this.currentStages.includes(stageNum))
        {
            let index = this.currentStages.indexOf(stageNum);
            this.currentStages.splice(index, 1);
        }
        else
        {
            throw new Error("invalid stage number");
        }
    }

    getStageByStageNum(stageNum) {
        if(Number.isInteger(stageNum))
        {
            let foundStage = null;
            this.stages.every((stage) => {
                if (stage.stageNum === stageNum) {
                    foundStage = stage;
                    return false;
                }
                return true;
            });
            if (foundStage === null)
                throw new Error("stage does not exist");
            return foundStage;
        }
        throw new Error("stage not numeric");
    }

    getCoverage(startingStages) {
        if(!startingStages.some(isNaN))
        {
            let coverage = [];
            for(let i=0;i<startingStages.length;i++)
            {
                if(!coverage.includes(startingStages[i]))
                {
                    coverage.push(startingStages[i]);
                }
                let stage = this.getStageByStageNum(startingStages[i]);
                this.getCoverage(stage.nextStages,coverage).forEach((stage)=>{
                    if(!coverage.includes(stage))
                    {
                        coverage.push(stage);
                    }
                });
            }
            return coverage;
        }
        else
        {
            throw new Error();
        }
    }

    handleStage(stageDetails) {
        let stage = this.getStageByStageNum(stageDetails.stageNum);
        this.filledOnlineForms = stageDetails.filledForms;
        stage.handleStage(stageDetails.fileNames, stageDetails.comments);
        for(let i=0;i<stage.nextStages.length;i++)
        {
            let currentStage = this.getStageByStageNum((stage.nextStages[i]));
            currentStage.removeStagesToWaitFor([stageDetails.stageNum]);
        }
    }

    advanceProcess(stageNum, nextStages, nextStagesRoleIDsOfDereg) {
        let stage = this.getStageByStageNum(stageNum);
        this.removeCurrentStage(stageNum);
        let nextChosenStages = stage.nextStages.filter((value) => nextStages.includes(value));
        let nextNotChosenStages = stage.nextStages.filter((value) => !nextStages.includes(value));
        let chosenPath = this.getCoverage(nextStages,[]);
        let notChosenPath = this.getCoverage(nextNotChosenStages,[]);
        let stagesToRemoveFromStagesToWaitFor = notChosenPath.filter((value) => !chosenPath.includes(value));
        for(let i=0;i<this.stages.length;i++)
        {
            this.getStageByStageNum(this.stages[i]).removeStagesToWaitFor(stagesToRemoveFromStagesToWaitFor);
        }
        for(let i=0;i<stage.nextStages.length;i++)
        {
            let nextStage = this.getStageByStageNum(stage.nextStages[i]);
            if(nextStage.haveNoOneToWaitFor())
            {
                if(nextChosenStages.includes(nextStage.stageNum))
                {
                    this.addCurrentStage(nextStage.stageNum);
                    if(nextStage.kind === 'ByDereg')
                    {
                        nextStage.roleID = nextStagesRoleIDsOfDereg[nextStage.dereg];
                    }
                }
            }
        }
    }

    isWaitingForUser(userEmail){
        for(let i=0;i<this.stages.length;i++)
        {
            if (this.currentStages.includes(this.stages[i].stageNum) && this.stages[i].roleID.toString() === roleID.toString() && this.stages[i].userEmail === userEmail) {
                return true;
            }
        }
        return false;
    }

    isAvailableForRole(roleID){
        for(let i=0;i<this.stages.length;i++)
        {
            if (this.currentStages.includes(this.stages[i].stageNum) && this.stages[i].roleID.toString() === roleID.toString() && this.stages[i].userEmail === null) {
                return true;
            }
        }
        return false;
    }

    isParticipatingInProcess(userEmail){
        for(let i=0;i<this.stages.length;i++)
        {
            if(this.stages[i].userEmail === userEmail)
            {
                return true;
            }
        }
        return false;
    }

    returnProcessToCreator(){
        let flag = true;
        let i = 0;
        for(i=0;i<this.stages.length;i++)
        {
            this.stages[i].stagesToWaitFor = this.stages[i].originStagesToWaitFor;
            if(this.initials.includes(this.stages[i].stageNum) && this.stages[i].userEmail.equals(this.creatorUserEmail))
            {
                if(flag)
                {
                    this.currentStages = [this.stages[i].stageNum];
                    flag = false;
                }
                else
                {
                    throw new Error("two initials with same roles");
                }
            }
        }
        return this.getStageByStageNum(this.currentStages[i]).userEmail;
    }

    getCurrentStageNumberForUser(userEmail){
        for(let i=0;i<this.currentStages.length;i++)
        {
            let stage = this.getStageByStageNum(this.currentStages[i]);
            if(stage.userEmail === userEmail)
            {
                return stage.stageNum;
            }
        }
        return -1;
    }

    assignUserToStage(roleID,userEmail){
        let hasChanged = false;
        for(let i=0;i<this.currentStages.length;i++)
        {
            let currentStage = this.getStageByStageNum(this.currentStages[i]);
            if(currentStage.roleID.id.equals(roleID.id) && this.currentStages[i].userEmail === undefined)
            {
                currentStage.userEmail = userEmail;
                hasChanged = true;
            }
        }
        if(!hasChanged)
            throw new Error('cant assign user');
        return true;
    }

    unAssignUserToStage(roleID,userEmail){
        let hasChanged = false;
        for(let i=0;i<this.currentStages.length;i++)
        {
            let currentStage = this.getStageByStageNum(this.currentStages[i]);
            if(currentStage.roleID.id.equals(roleID.id) && this.currentStages[i].userEmail === userEmail)
            {
                currentStage.userEmail = undefined;
                hasChanged = true;
            }
        }
        if(!hasChanged)
            throw new Error('cant unassign user');
        return true;
    }

    isFinished()
    {
        return this.currentStages.length === 0;
    }

    getParticipatingUsers(){
        let userEmails = [];
        for(let i=0;i<this.stages.length;i++)
        {
            if(this.stages[i].userEmail !== null && this.stages[i].userEmail !== undefined && !userEmails.includes(this.stages[i].userEmail))
            {
                userEmails.push(this.stages[i].userEmail);
            }
        }
        return userEmails;
    }

    isStageExists(stageNum)
    {
        let isFoundStage = false;
        this.stages.forEach((stage) => {
            if(stage.stageNum === stageNum){
                if(isFoundStage)
                {
                    throw new Error();
                }
                isFoundStage = true;
            }});
        return isFoundStage;
    }
}

module.exports = activeProcess;
