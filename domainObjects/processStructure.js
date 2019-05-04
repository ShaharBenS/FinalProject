class processStructure {

    constructor(structureName, stages, sankey,available,onlineForms,automaticAdvanceTime, notificationTime) {
        this.structureName = structureName;
        this.stages = stages;
        this.sankey = sankey;
        this.available = available;
        this.onlineForms = onlineForms;
        this.automaticAdvanceTime = automaticAdvanceTime;
        this.notificationTime = notificationTime;
    }

    getInitialStageByRoleID(roleID, dereg)
    {
        let initialStages = this.stages.filter((stage)=>stage.stagesToWaitFor.length === 0);
        while(initialStages.length !== 0)
        {
            let firstStage = initialStages.shift();
            if(firstStage.kind === 'ByRole' && roleID.id.equals(firstStage.roleID.id))
            {
                return firstStage.stageNum;
            }
            if(firstStage.kind === 'ByDereg' && dereg === firstStage.dereg)
            {
                return firstStage.stageNum;
            }
            for(let i=0;i<firstStage.nextStages.length;i++)
            {
                initialStages.push(this.getStageByStageNum(firstStage.nextStages[i]));
            }
        }
        return -1;
    }

    checkNotDupStagesInStructure()
    {
        for(let i=0;i<this.stages.length;i++)
        {
            for(let j=0;j<this.stages.length;j++)
            {
                if(i !== j)
                {
                    if(this.stages[i].stageNum === this.stages[j].stageNum)
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    checkPrevNextSymmetric()
    {
        for(let i=0;i<this.stages.length;i++)
        {
            for(let j=0;j<this.stages[i].stagesToWaitFor.length;j++)
            {
                for(let k=0;k<this.stages.length;k++)
                {
                    if(this.stages[k].stageNum === this.stages[i].stagesToWaitFor[j])
                    {
                        if(!this.stages[k].nextStages.includes(this.stages[i].stageNum))
                        {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };

    checkNextPrevSymmetric()
    {
        for(let i=0;i<this.stages.length;i++)
        {
            for(let j=0;j<this.stages[i].nextStages.length;j++)
            {
                for(let k=0;k<this.stages.length;k++)
                {
                    if(this.stages[k].stageNum === this.stages[i].nextStages[j])
                    {
                        if(!this.stages[k].stagesToWaitFor.includes(this.stages[i].stageNum))
                        {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };

    getStageByStageNum(stageNum)
    {
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
}

module.exports = processStructure;