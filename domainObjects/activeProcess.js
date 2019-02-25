"use strict";

class activeProcess {

    constructor(processName, timeCreation, notificationTime, currentStages, initials, stages) {
        this.processName = processName;
        this.notificationTime = notificationTime;
        this.currentStages = currentStages;
        this.initials = initials;
        this.stages = stages;
        this._timeCreation = timeCreation;

    }

    updateStage(stageNum, newStage) {
        let stage = this.getStageByStageNum(stageNum);
        let index = this.stages.indexOf(stage);
        if (index < 0) throw new Error("stage not found");
        if (stage.isValidStage(newStage))
            this.stages[index] = newStage;
        else
            throw new Error("too much difference");
    }

    addCurrentStage(stageNum) {
        if (stageNum === undefined || this.currentStages.includes(stageNum))
            throw new Error("invalid stage number");
        else this.currentStages.push(stageNum);
    }

    removeCurrentStage(stageNum) {
        if (stageNum === undefined || !this.currentStages.includes(stageNum))
            throw new Error("invalid stage number");
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

        this.stages.forEach((stage) => {
            let index = stage.nextStages.indexOf(stageNum);
            if (index >= 0) stage.nextStages.splice(index, 1);
        });

        let index = this.stages.indexOf(_stage);
        this.stages.splice(index, 1);
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

    handleStage(stageNum, filledForms, fileNames, comments) {
        let stage = this.getStageByStageNum(stageNum);
        stage.handleStage(filledForms, fileNames, comments);
        stage.nextStages.forEach((_stageNum) => {
            let _stage = this.getStageByStageNum((_stageNum));
            _stage.removeStagesToWaitFor(stageNum);
        })
    }

    advanceProcess(nextStages) {
        this.currentStages.forEach((stageNum) => {
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

    isWaitingForUser(roleID, userEmail) {
        for (let i = 0; i < this.stages.length; i++) {
            if (this.currentStages.includes(this.stages[i].stageNum) && this.stages[i].roleID.toString() === roleID.toString() && (this.stages[i].userEmail === null || this.stages[i].userEmail === userEmail)) {
                return true;
            }
        }
        return false;
    }

    isParticipatingInProcess(userEmail) {
        for (let i = 0; i < this.stages.length; i++) {
            if (this.stages[i].userEmail === userEmail) {
                return true;
            }
        }
        return false;
    }
}

module.exports = activeProcess;
