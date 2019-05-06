class activeProcess {

    constructor(processObject,stages) {
        this.processName = processObject.processName;
        this.creatorUserEmail = processObject.creatorUserEmail;
        this.processDate = processObject.processDate;
        this.processUrgency = processObject.processUrgency;
        this.creationTime = processObject.creationTime;
        this.notificationTime = processObject.notificationTime;
        this.automaticAdvanceTime = processObject.automaticAdvanceTime;
        this.currentStages = processObject.currentStages;
        this.onlineForms = processObject.onlineForms;
        this.filledOnlineForms = processObject.filledOnlineForms;
        this.lastApproached = processObject.lastApproached;
        this.stageToReturnTo = processObject.stageToReturnTo;
        this.stages = stages;
    }

    removeStage(stageToRemove){
        if(Number.isInteger(stageToRemove))
        {
            let i,stage = null;
            for(i=0;i<this.stages.length;i++)
            {
                if(this.stages[i].stageNum === stageToRemove)
                {
                    stage = this.stages[i];
                    break;
                }
            }
            if(stage instanceof Error) return stage;
            for(let j=0;j<stage.stagesToWaitFor.length;j++)
            {
                let prevStage = this.getStageByStageNum(stage.stagesToWaitFor[j]);
                if(prevStage instanceof Error) return prevStage;
                let result = prevStage.removeNextStages([stage.stageNum]);
                if(result instanceof Error) return result;
                result = prevStage.addNextStages(stage.nextStages);
                if(result instanceof Error) return result;
            }
            for(let j=0;j<stage.nextStages.length;j++)
            {
                let nextStage = this.getStageByStageNum(stage.nextStages[j]);
                if(nextStage instanceof Error) return nextStage;
                let result = nextStage.removeStagesToWaitForIncludingOrigin([stage.stageNum]);
                if(result instanceof Error) return result;
                result = nextStage.addStagesToWaitForIncludingOrigin(stage.stagesToWaitFor);
                if(result instanceof Error) return result;
            }
            this.stages.splice(i,1);
        }
        else {
            return new Error("removeStage: stage isn't numeric");
        }
    }

    addCurrentStage(stageNum) {
        if(!this.isStageExists(stageNum))
        {
            return new Error("addCurrentStage: stage doesn't exist");
        }
        if(Number.isInteger(stageNum) && !this.currentStages.includes(stageNum))
        {
            this.currentStages.push(stageNum);
        }
        else
        {
            return new Error("addCurrentStage: invalid stage number");
        }
    }

    removeCurrentStage(stageNum) {
        if(!this.isStageExists(stageNum))
        {
            return new Error("removeCurrentStage: stage doesnt exist");
        }
        if(Number.isInteger(stageNum) && this.currentStages.includes(stageNum))
        {
            let index = this.currentStages.indexOf(stageNum);
            this.currentStages.splice(index, 1);
        }
        else
        {
            return new Error("removeCurrentStage: invalid stage number");
        }
    }

    getStageByStageNum(stageNum) {
        if(Number.isInteger(stageNum))
        {
            for(let i=0;i<this.stages.length;i++)
            {
                if(this.stages[i].stageNum === stageNum)
                {
                    return this.stages[i];
                }
            }
            return new Error("getStageByStageNum: stage does not exist");
        }
        return new Error("getStageByStageNum: stage not numeric");
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
                if(stage instanceof Error) return stage;
                let coverageResult = this.getCoverage(stage.nextStages);
                if(coverageResult instanceof Error) return coverageResult;
                coverageResult.forEach((stage)=>{
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
            return new Error("getCoverage: some stages are not numeric");
        }
    }

    handleStage(stageDetails) {
        let stage = this.getStageByStageNum(stageDetails.stageNum);
        if(stage instanceof Error) return stage;
        if(stage.kind === 'Creator') {
            this.stageToReturnTo = stageDetails.stageNum;
        }
        let result = stage.handleStage();
        if(result instanceof Error) return result;
        for(let i=0;i<stage.nextStages.length;i++)
        {
            let currentStage = this.getStageByStageNum((stage.nextStages[i]));
            if(currentStage instanceof Error) return currentStage;
            let result = currentStage.removeStagesToWaitFor([stageDetails.stageNum]);
            if(result instanceof Error) return result;
        }
    }

    advanceProcess(stageNum, nextStages) {
        let stage = this.getStageByStageNum(stageNum);
        if(stage instanceof Error) return stage;
        let result = this.removeCurrentStage(stageNum);
        if(result instanceof Error) return result;
        let nextChosenStages = stage.nextStages.filter((value) => nextStages.includes(value));
        let nextNotChosenStages = stage.nextStages.filter((value) => !nextStages.includes(value));
        let chosenPath = this.getCoverage(nextStages);
        if(chosenPath instanceof Error) return chosenPath;
        let notChosenPath = this.getCoverage(nextNotChosenStages);
        if(notChosenPath instanceof Error) return notChosenPath;
        let stagesToRemoveFromStagesToWaitFor = notChosenPath.filter((value) => !chosenPath.includes(value));
        let addedStages = [];
        for(let i=0;i<this.stages.length;i++)
        {
            let result = this.stages[i].removeStagesToWaitFor(stagesToRemoveFromStagesToWaitFor);
            if(result instanceof Error) return result;
        }
        for(let i=0;i<stage.nextStages.length;i++)
        {
            let nextStage = this.getStageByStageNum(stage.nextStages[i]);
            if(nextStage instanceof Error) return nextStage;
            if(nextStage.haveNoOneToWaitFor())
            {
                if(nextChosenStages.includes(nextStage.stageNum))
                {
                    let result = this.addCurrentStage(nextStage.stageNum);
                    if(result instanceof Error) return result;
                    if(nextStage.userEmail !== null) nextStage.assignmentTime = new Date();
                    addedStages.push(nextStage.stageNum);
                }
            }
        }
        return addedStages;
    }

    isWaitingForUser(userEmail){
        for(let i=0;i<this.currentStages.length;i++)
        {
            let stage = this.getStageByStageNum(this.currentStages[i]);
            if(stage instanceof Error) return stage;
            if(stage.userEmail === userEmail) {
                return true;
            }
        }
        return false;
    }

    isAvailableForRole(roleID){
        for(let i=0;i<this.currentStages.length;i++)
        {
            let stage = this.getStageByStageNum(this.currentStages[i]);
            if(stage instanceof Error) return stage;
            if (stage.roleID !== null && stage.roleID.id.equals(roleID.id) && stage.userEmail === null) {
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
        let stagesToRevert = [];
        let stageToReturnTo = this.getStageByStageNum(this.stageToReturnTo);
        if(stageToReturnTo instanceof Error) return stageToReturnTo;
        stagesToRevert.push(stageToReturnTo);
        while(stagesToRevert.length !== 0)
        {
            let firstStage = stagesToRevert.shift();
            if(firstStage.assignmentTime !== null)
            {
                firstStage.approvalTime = null;
                firstStage.stagesToWaitFor = this.stageToReturnTo === firstStage.stageNum?[]:firstStage.originStagesToWaitFor;
                for(let i=0;i<firstStage.nextStages.length;i++)
                {
                    let stageToRev = this.getStageByStageNum(firstStage.nextStages[i]);
                    if(stageToRev instanceof Error) return stageToRev;
                    stagesToRevert.push(stageToRev);
                }
            }
        }
        this.currentStages = [this.stageToReturnTo];
        return stageToReturnTo.userEmail;
    }

    getCurrentStageNumberForUser(userEmail){
        for(let i=0;i<this.currentStages.length;i++)
        {
            let stage = this.getStageByStageNum(this.currentStages[i]);
            if(stage instanceof Error) return stage;
            if(stage.userEmail === userEmail)
            {
                return stage.stageNum;
            }
        }
        return -1;
    }

    assignUserToStage(roleID,userEmail){
        let today = new Date();
        let hasChanged = false;
        let currentStage = null;
        for(let i=0;i<this.currentStages.length;i++)
        {
            currentStage = this.getStageByStageNum(this.currentStages[i]);
            if(currentStage instanceof Error) return currentStage;
            if(currentStage.roleID.id.equals(roleID.id) && currentStage.userEmail === null)
            {
                currentStage.userEmail = userEmail;
                currentStage.assignmentTime = today;
                hasChanged = true;
                break;
            }
        }
        if(!hasChanged)
            return new Error('assignUserToStage: cant assign user');
        else {
            if (currentStage.kind === 'ByDereg') {
                let dereg = currentStage.dereg;
                let initialStages = [currentStage];
                while (initialStages.length !== 0) {
                    let firstStage = initialStages.shift();
                    if (firstStage.kind === 'ByDereg' && dereg === firstStage.dereg && firstStage.userEmail === null) {
                        firstStage.userEmail = userEmail;
                    }
                    for (let i = 0; i < firstStage.nextStages.length; i++) {
                        let nextStage = this.getStageByStageNum(firstStage.nextStages[i]);
                        if(nextStage instanceof Error) return nextStage;
                        initialStages.push(nextStage);
                    }
                }
            }
        }
    }

    unAssignUserToStage(roleID,userEmail){
        let hasChanged = false;
        let currentStage = null;
        for(let i=0;i<this.currentStages.length;i++)
        {
            currentStage = this.getStageByStageNum(this.currentStages[i]);
            if(currentStage instanceof Error) return currentStage;
            if(currentStage.roleID.id.equals(roleID.id) && currentStage.userEmail === userEmail)
            {
                currentStage.userEmail = null;
                currentStage.assignmentTime = null;
                hasChanged = true;
                break;
            }
        }
        if(!hasChanged)
            return new Error('unAssignUserToStage: cant unAssign user');
        else
        {
            if (currentStage.kind === 'ByDereg') {
                let dereg = currentStage.dereg;
                let initialStages = [currentStage];
                while (initialStages.length !== 0) {
                    let firstStage = initialStages.shift();
                    if (firstStage.kind === 'ByDereg' && dereg === firstStage.dereg && firstStage.userEmail === userEmail) {
                        firstStage.userEmail = null;
                    }
                    for (let i = 0; i < firstStage.nextStages.length; i++) {
                        let nextStage = this.getStageByStageNum(firstStage.nextStages[i]);
                        if(nextStage instanceof Error) return nextStage;
                        initialStages.push(nextStage);
                    }
                }
            }
        }
    }

    isFinished()
    {
        return this.currentStages.length === 0;
    }

    getParticipatingUsers(){
        let userEmails = [];
        for(let i=0;i<this.stages.length;i++)
        {
            if(this.stages[i].userEmail !== null && !userEmails.includes(this.stages[i].userEmail))
            {
                userEmails.push(this.stages[i].userEmail);
            }
        }
        return userEmails;
    }

    isStageExists(stageNum)
    {
        if(!isNaN(stageNum))
        {
            for(let i=0;i<this.stages.length;i++)
            {
                let stage = this.stages[i];
                if(stage.stageNum === stageNum) {
                    return true;
                }
            }
            return false;
        }
        else
        {
            return new Error("isStageExists: stage isn't numeric");
        }
    }

    incrementNotificationsCycle(stageNumbers)
    {
        for(let i=0;i<stageNumbers.length;i++)
        {
            let stage = this.getStageByStageNum(stageNumbers[i]);
            if(stage instanceof Error) return stage;
            stage.notificationsCycle = stage.notificationsCycle + 1;
        }
    }
}

module.exports = activeProcess;
