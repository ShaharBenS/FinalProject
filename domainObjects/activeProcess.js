class activeProcess
{
    processName;
    notificationTime;
    currentStages;
    initials;
    stages;

    constructor(processName, timeCreation, notificationTime, currentStages, initials, stages)
    {
        this.processName = processName;
        this.notificationTime = notificationTime;
        this.currentStages = currentStages;
        this.initials = initials;
        this.stages = stages;
        this._timeCreation = timeCreation;

    }

    addCurrentStage(stageNum)
    {
        if (stageNum === undefined || this.currentStages.includes(stageNum))
            return new Error("invalid stage number");
        else this.currentStages.push(stageNum);
    }

    removeCurrentStage(stageNum)
    {
        if (stageNum === undefined || !this.currentStages.includes(stageNum))
            return new Error("invalid stage number");
        else {
            let index = this.currentStages.indexOf(stageNum);
            this.currentStages.splice(index, 1);
        }
    }

    get timeCreation()
    {
        return this._timeCreation;
    }

    set timeCreation(value)
    {
        if(this.timeCreation === undefined)
            this._timeCreation = value;
        else throw new Error();
    }



}

export {activeProcess};