class activeProcess {
    processName;
    notificationTime;
    currentStages;
    initials;
    stages;

    constructor(processName, timeCreation, notificationTime, currentStages, initials, stages) {
        this.processName = processName;
        this.notificationTime = notificationTime;
        this.currentStages = currentStages;
        this.initials = initials;
        this.stages = stages;
        this._timeCreation = timeCreation;

    }

    addCurrentStage(stageNum) {
        if (stageNum === undefined || this.currentStages.includes(stageNum))
            return new Error("invalid stage number");
        else this.currentStages.push(stageNum);
    }

    removeCurrentStage(stageNum) {
        if (stageNum === undefined || !this.currentStages.includes(stageNum))
            return new Error("invalid stage number");
        else {
            let index = this.currentStages.indexOf(stageNum);
            this.currentStages.splice(index, 1);
        }
    }

    get timeCreation() {
        return this._timeCreation;
    }

    set timeCreation(value) {
        if (this.timeCreation === undefined)
            this._timeCreation = value;
        else throw new Error();
    }

    getStageByStageNum(stageNum) {
        let foundStage;
        this.stages.every((stage) => {
            if (stage.stageNum === stageNum) {
                foundStage = stage;
                return false;
            }
            return true;
        });
        if (foundStage === undefined)
            throw new Error("stage does not exist");
        return foundStage;
    }

    getAllStagesInPathFrom(stageNum) {
        let _this = this;
        let pathStages = [];
        let recursive = function (stageNum) {
            pathStages.push(stageNum);
            _this.getStageByStageNum(stageNum).nextStages.forEach((iStage) => recursive(iStage));
        };
        this.currentStages.forEach((currStage) => recursive(currStage));
        return pathStages;
    }

    removeStage(stageNum) {
        this.getStageByStageNum(stageNum).nextStages.forEach((_stageNum) => {
            let stage = this.getStageByStageNum(_stageNum);
            let index = stage.stagesToWaitFor.indexOf(stageNum);
            stage.splice(index, 1);
        });
        let index = this.stages.indexOf(stageNum);
        this.stages.splice(index, 1);
    }

    removePathStages(removePathStages, exclude) {
        let _this = this;
        let recursive = function (stageNum) {
            if (!exclude.includes(stageNum)) {
                let next = _this.getStageByStageNum(stageNum).nextStages;
                _this.removeStage(stageNum);
                next.forEach((iStage) => recursive(iStage));
            }
        };
        removePathStages.forEach((stageNum) => recursive(stageNum));
    }

    advanceProcess(nextStages) {
        this.currentStages.forEach((stageNum) => {
            let stage = this.getStageByStageNum(stageNum);
            if (stage.haveNoOneToWaitFor()) {
                nextStages.forEach((stageNum) => this.addCurrentStage(stageNum));
                this.removeCurrentStage(stage.stageNum);
                let pathStages = this.getAllStagesInPathFrom(stageNum);
                let removePathStages = stage.nextStages.filter((value) => !nextStages.includes(value));
                this.removePathStages(removePathStages, pathStages);
            }
        });
    }
}

export {activeProcess};