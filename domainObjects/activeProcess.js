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
        this.lastApproached = processObject.lastApproached;
        this.stageToReturnTo = processObject.stageToReturnTo;
        this.stages = stages;
    }

    removeStage(stageToRemove){
        if(Number.isInteger(stageToRemove))
        {
            let stage = null, i;
            for(i=0;i<this.stages.length;i++)
            {
                if(this.stages[i].stageNum === stageToRemove)
                {
                    stage = this.stages[i];
                    break;
                }
            }
            if(stage === null) throw new Error('stage wasnt found');
            for(let j=0;j<stage.stagesToWaitFor.length;j++)
            {
                let prevStage = this.getStageByStageNum(stage.stagesToWaitFor[j]);
                prevStage.removeNextStages([stage.stageNum]);
                prevStage.addNextStages(stage.nextStages);
            }
            for(let j=0;j<stage.nextStages.length;j++)
            {
                let nextStage = this.getStageByStageNum(stage.nextStages[j]);
                nextStage.removeStagesToWaitFor([stage.stageNum]);
                nextStage.addStagesToWaitFor(stage.stagesToWaitFor);
            }
            this.stages.splice(i,1);
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
                this.getCoverage(stage.nextStages).forEach((stage)=>{
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
        if(stage.kind === 'Creator') {
            this.stageToReturnTo = stageDetails.stageNum;
        }
        stage.handleStage(stageDetails.fileNames, stageDetails.comments);
        for(let i=0;i<stage.nextStages.length;i++)
        {
            let currentStage = this.getStageByStageNum((stage.nextStages[i]));
            currentStage.removeStagesToWaitFor([stageDetails.stageNum]);
        }
    }

    advanceProcess(stageNum, nextStages) {
        let stage = this.getStageByStageNum(stageNum);
        this.removeCurrentStage(stageNum);
        let nextChosenStages = stage.nextStages.filter((value) => nextStages.includes(value));
        let nextNotChosenStages = stage.nextStages.filter((value) => !nextStages.includes(value));
        let chosenPath = this.getCoverage(nextStages,[]);
        let notChosenPath = this.getCoverage(nextNotChosenStages,[]);
        let stagesToRemoveFromStagesToWaitFor = notChosenPath.filter((value) => !chosenPath.includes(value));
        let addedStages = [];
        for(let i=0;i<this.stages.length;i++)
        {
            this.stages[i].removeStagesToWaitFor(stagesToRemoveFromStagesToWaitFor);
        }
        for(let i=0;i<stage.nextStages.length;i++)
        {
            let nextStage = this.getStageByStageNum(stage.nextStages[i]);
            if(nextStage.haveNoOneToWaitFor())
            {
                if(nextChosenStages.includes(nextStage.stageNum))
                {
                    this.addCurrentStage(nextStage.stageNum);
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
        stagesToRevert.push(stageToReturnTo);
        while(stagesToRevert.length !== 0)
        {
            let firstStage = stagesToRevert.shift();
            if(firstStage.assignmentTime !== null)
            {
                firstStage.approvalTime = null;
                firstStage.stagesToWaitFor = this.stageToReturnTo === firstStage.stageNum?[]:firstStage.originStagesToWaitFor;
                firstStage.attachedFilesNames = [];
                firstStage.comments = '';
                for(let i=0;i<firstStage.nextStages.length;i++)
                {
                    stagesToRevert.push(this.getStageByStageNum(firstStage.nextStages[i]));
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
            if(currentStage.roleID.id.equals(roleID.id) && currentStage.userEmail === null)
            {
                currentStage.userEmail = userEmail;
                currentStage.assignmentTime = today;
                hasChanged = true;
                break;
            }
        }
        if(!hasChanged)
            throw new Error('cant assign user');
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
                        initialStages.push(this.getStageByStageNum(firstStage.nextStages[i]));
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
            if(currentStage.roleID.id.equals(roleID.id) && currentStage.userEmail === userEmail)
            {
                currentStage.userEmail = null;
                currentStage.assignmentTime = null;
                hasChanged = true;
                break;
            }
        }
        if(!hasChanged)
            throw new Error('cant unassign user');
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
                        initialStages.push(this.getStageByStageNum(firstStage.nextStages[i]));
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
            throw new Error('stage isnt numeric');
        }
    }

    incrementNotificationsCycle(stageNumbers)
    {
        for(let i=0;i<stageNumbers.length;i++)
        {
            let stage = this.getStageByStageNum(stageNumbers[i]);
            stage.notificationsCycle = stage.notificationsCycle + 1;
        }
    }
}

module.exports = activeProcess;
