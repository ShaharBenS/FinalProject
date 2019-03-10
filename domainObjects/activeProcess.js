class activeProcess {

    constructor(processName, creationTime, notificationTime, currentStages, initials, stages, lastApproached) {
        this._processName = processName;
        this._creationTime = creationTime;
        this._notificationTime = notificationTime;
        this._currentStages = currentStages;
        this._initials = initials;
        this._stages = stages;
        this._lastApproached = lastApproached;
    }

    attachOnlineFormToStage(stageNum, formName) {
        let stage = this.getStageByStageNum(stageNum);
        stage.attachOnlineForm(formName);
    }

    addCurrentStage(stageNum) {
        if (stageNum === undefined || this._currentStages.includes(stageNum))
            throw new Error("invalid stage number");
        else this._currentStages.push(stageNum);
    }

    removeCurrentStage(stageNum) {
        if (stageNum === undefined || !this._currentStages.includes(stageNum))
            throw new Error("invalid stage number");
        else {
            let index = this._currentStages.indexOf(stageNum);
            this._currentStages.splice(index, 1);
        }
    }

    get processName() {
        return this._processName;
    }

    set processName(value) {
        this._processName = value;
    }

    get creationTime() {
        return this._creationTime;
    }

    set creationTime(value) {
        if (this.creationTime === undefined)
            this._creationTime = value;
        else throw new Error();
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

    getStageByStageNum(stageNum) {
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

    getCoverage(startingStages) {
        let _this = this;
        let pathStages = [];
        let recursive = function (stageNum) {
            if (!pathStages.includes(stageNum)) {
                pathStages.push(stageNum);
                _this.getStageByStageNum(stageNum).nextStages.forEach((iStage) => recursive(iStage));
            }
        };
        startingStages.forEach((stageNum) => recursive(stageNum));
        return pathStages;
    }

    removeStage(stageNum) {
        let _stage = this.getStageByStageNum(stageNum);
        _stage.nextStages.forEach((_stageNum) => {
            let stage = this.getStageByStageNum(_stageNum);
            let index = stage.stagesToWaitFor.indexOf(stageNum);
            stage.stagesToWaitFor.splice(index, 1);
        });

        this._stages.forEach((stage) => {
            let index = stage.nextStages.indexOf(stageNum);
            if (index >= 0) stage.nextStages.splice(index, 1);
        });

        let index = this._stages.indexOf(_stage);
        this._stages.splice(index, 1);
    }

    removePathStages(removePathStages, exclude) {
        let _this = this;
        let recursive = function (stageNum) {
            if (!exclude.includes(stageNum)) {
                let next = _this.getStageByStageNum(stageNum).nextStages;
                exclude.push(stageNum);
                _this.removeStage(stageNum);
                next.forEach((iStage) => recursive(iStage));
            }
        };
        removePathStages.forEach((stageNum) => recursive(stageNum));
    }

    handleStage(stageDetails) {
        let stage = this.getStageByStageNum(stageDetails.stageNum);
        stage.handleStage(stageDetails.filledForms, stageDetails.fileNames, stageDetails.comments);
        for(let i=0;i<stage.nextStages.length;i++)
        {
            let currentStage = this.getStageByStageNum((stage.nextStages[i]));
            currentStage.removeStagesToWaitFor(stageDetails.stageNum);
        }
    }

    advanceProcess(nextStages) {
        this._currentStages.forEach((stageNum) => {
            let stage = this.getStageByStageNum(stageNum);
            if (stage.haveNoOneToWaitFor()) {
                nextStages.forEach((stageNum) => this.addCurrentStage(stageNum));
                this.removeCurrentStage(stage.stageNum);
                let pathStages = this.getCoverage(nextStages);
                let removePathStages = stage.nextStages.filter((value) => !nextStages.includes(value));
                this.removePathStages(removePathStages, pathStages);
            }
        });
    }

    isWaitingForUser(roleID,userEmail){
        for(let i=0;i<this._stages.length;i++)
        {
            if (this._currentStages.includes(this._stages[i].stageNum) && this._stages[i].roleID.toString() === roleID.toString() && (this._stages[i].userEmail === null || this._stages[i].userEmail === userEmail)) {
                return true;
            }
        }
        return false;
    }

    isParticipatingInProcess(userEmail){
        for(let i=0;i<this._stages.length;i++)
        {
            if(this._stages[i].userEmail === userEmail)
            {
                return true;
            }
        }
        return false;
    }

    returnAllOriginalStagesToWaitFor() {
        for(let i=0;i<this._stages.length;i++)
        {
            this._stages[i].stagesToWaitFor = this._stages[i].originStagesToWaitFor;
        }
    }

    getStageNumberForUser(userEmail){
        for(let i=0;i<this._stages.length;i++)
        {
            if(this._stages[i].userEmail === userEmail)
            {
                return this._stages[i].stageNum;
            }
        }
        return -1;
    }
}

module.exports = activeProcess;
