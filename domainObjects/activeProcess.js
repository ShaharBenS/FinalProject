class activeProcess {

    constructor(processObject,stages) {
        this._processName = processObject.processName;
        this._creatorRole = processObject.creatorRole;
        this._processDate = processObject.processDate;
        this._processUrgency = processObject.processUrgency;
        this._creationTime = processObject.creationTime;
        this._notificationTime = processObject.notificationTime;
        this._currentStages = processObject.currentStages;
        this._initials = processObject.initials;
        this._stages = stages;
        this._lastApproached = processObject.lastApproached;
    }

    get processName() {
        return this._processName;
    }

    set processName(value) {
        this._processName = value;
    }

    get creatorRole() {
        return this._creatorRole;
    }

    set creatorRole(value) {
        this._creatorRole = value;
    }

    get creationTime() {
        return this._creationTime;
    }

    set creationTime(value) {
        if (this.creationTime === undefined)
            this._creationTime = value;
        else throw new Error();
    }

    get processDate() {
        return this._processDate;
    }

    set processDate(value) {
        this._processDate = value;
    }

    get processUrgency() {
        return this._processUrgency;
    }

    set processUrgency(value) {
        this._processUrgency = value;
    }

    get notificationTime() {
        return this._notificationTime;
    }

    set notificationTime(value) {
        this._notificationTime = value;
    }

    get currentStages() {
        return this._currentStages;
    }

    set currentStages(value) {
        this._currentStages = value;
    }

    get initials() {
        return this._initials;
    }

    set initials(value) {
        this._initials = value;
    }

    get stages() {
        return this._stages;
    }

    set stages(value) {
        this._stages = value;
    }

    get lastApproached() {
        return this._lastApproached;
    }

    set lastApproached(value) {
        this._lastApproached = value;
    }

    attachOnlineFormToStage(stageNum, formName) {
        let stage = this.getStageByStageNum(stageNum);
        stage.attachOnlineForm(formName);
    }

    addCurrentStage(stageNum) {
        if(!this.isStageExists(stageNum))
        {
            throw new Error('stage doesnt exist');
        }
        if(Number.isInteger(stageNum) && !this._currentStages.includes(stageNum))
        {
            this._currentStages.push(stageNum);
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
        if(Number.isInteger(stageNum) && this._currentStages.includes(stageNum))
        {
            let index = this._currentStages.indexOf(stageNum);
            this._currentStages.splice(index, 1);
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
            this._stages.every((stage) => {
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
        stage.handleStage(stageDetails.filledForms, stageDetails.fileNames, stageDetails.comments);
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
        for(let i=0;i<stage.nextStages.length;i++)
        {
            let nextStage = this.getStageByStageNum(stage.nextStages[i]);
            if(nextStage.haveNoOneToWaitFor())
            {
                if(nextChosenStages.includes(nextStage.stageNum))
                {
                    this.addCurrentStage(nextStage.stageNum);
                }
                else
                {
                    stage.removeStagesToWaitFor(stagesToRemoveFromStagesToWaitFor);
                }
            }
        }

    }

    isWaitingForUser(roleID,userEmail){
        for(let i=0;i<this._stages.length;i++)
        {
            if (this._currentStages.includes(this._stages[i].stageNum) && this._stages[i].role.id.toString() === roleID.toString() && this._stages[i].user !== null &&  this._stages[i].user.userEmail === userEmail) {
                return true;
            }
        }
        return false;
    }

    isAvailableForRole(roleID){
        for(let i=0;i<this._currentStages.length;i++)
        {
            let currentStage = this.getStageByStageNum(this._currentStages[i]);
            if (currentStage.role.id.toString() === roleID.toString() && currentStage.user === null) {
                return true;
            }
        }
        return false;
    }

    isParticipatingInProcess(userEmail){
        for(let i=0;i<this._stages.length;i++)
        {
            if(this._stages[i].user !== null && this._stages[i].user.userEmail === userEmail)
            {
                return true;
            }
        }
        return false;
    }

    returnProcessToCreator(){
        let flag = true;
        for(let i=0;i<this._stages.length;i++)
        {
            this._stages[i].stagesToWaitFor = this._stages[i].originStagesToWaitFor;
            if(this._initials.includes(this._stages[i].stageNum) && this._stages[i].role.id.equals(this._creatorRole.id))
            {
                if(flag)
                {
                    this._currentStages = [this._stages[i].stageNum];
                    flag = false;
                }
                else
                {
                    throw new Error("two initials with same roles");
                }
            }
        }
        return this.getStageByStageNum(this._currentStages[0]).userEmail;
    }

    getCurrentStageNumberForUser(userEmail){
        for(let i=0;i<this._currentStages.length;i++)
        {
            let stage = this.getStageByStageNum(this._currentStages[i]);
            if(stage.user !== null && stage.user.userEmail === userEmail)
            {
                return stage.stageNum;
            }
        }
        return -1;
    }

    assignUserToStage(role,user){
        for(let i=0;i<this._currentStages.length;i++)
        {
            let currentStage = this.getStageByStageNum(this._currentStages[i]);
            if(currentStage.role._id.id.equals(role.id) && currentStage.user === null)
            {
                currentStage.user = user;
                return this._currentStages[i];
            }
        }
        throw new Error('cant assign user');
    }

    unAssignUserToStage(roleID,userEmail){
        let hasChanged = false;
        for(let i=0;i<this._currentStages.length;i++)
        {
            let currentStage = this.getStageByStageNum(this._currentStages[i]);
            if(currentStage.roleID.id.equals(roleID.id) && currentStage.user.userEmail === userEmail)
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
        return this._currentStages.length === 0;
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
        this._stages.forEach((stage) => {
            if(stage.stageNum === stageNum){
                if(isFoundStage)
                {
                    throw new Error();
                }
                isFoundStage = true;
            }});
        return isFoundStage;
    }
/*
    getCurrentStagesUserEmailsAndRoles(){
        let answer = [];
        for(let i=0;i<this._currentStages.length)
        {
            let stage = this.getStageByStageNum(this._currentStages[i]);
        }
    }*/
}

module.exports = activeProcess;
