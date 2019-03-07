class processStructure {

    constructor(structureName, initials, stages,sankey) {
        this.structureName = structureName;
        this.initials = initials;
        this.stages = stages;
        this.sankey = sankey;
    }

    getInitialStageByRoleID(roleID) {
        let initialStage = -1;
        this.stages.every((stage) => {
            let roleEqual = stage.roleID.id.toString() === roleID.id.toString();
            let initialsInclude = this.initials.includes(stage.stageNum);
            if (roleEqual && initialsInclude) {
                initialStage = stage.stageNum;
                return false;
            }
            return true;
        });
        return initialStage;
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

    checkInitialsExistInProcessStages()
    {
        for(let i=0;i<this.initials.length;i++)
        {
            let found = false;
            for(let j=0;j<this.stages.length;j++)
            {
                if(this.initials[i] === this.stages[j].stageNum)
                {
                    found = true;
                }
            }
            if(!found)
            {
                return false;
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

    getFormsOfStage() {
        return this.stages.reduce((acc, stage) => {
            acc[stage.roleID] = stage.onlineForms;
            return acc;
        }, {})
    }
}

module.exports = processStructure;