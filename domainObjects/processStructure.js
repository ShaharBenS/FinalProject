class processStructure {

    structureName;
    initials;
    stages;
    sankey;

    constructor(structureName, initials, stages, sankey) {
        this.structureName = structureName;
        this.initials = initials;
        this.stages = stages;
        this.sankey = sankey;
    }

    canStartProcess(roleID) {
        let initialStage = -1;
        this.stages.every((stage) => {
            let roleEqual = stage.roleID.id.equals(roleID.id);
            let initialsInclude = this.initials.includes(stage.stageNum);
            if (roleEqual && initialsInclude) {
                initialStage = stage.stageNum;
                return false;
            }
            return true;
        });
        return initialStage !== -1;
    }

}

export {processStructure};