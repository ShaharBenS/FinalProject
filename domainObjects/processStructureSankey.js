class processStructureSankey
{
    constructor(sankey)
    {
        this.sankey = sankey;
    }

    getSankeyStages()
    {
        this.sankey.content.diagram.filter((figure) =>
        {
            return figure.type !== "sankey.shape.Connection";
        });
    }

    getStages(roleNameToIdFunc)
    {
        let stages = this.getSankeyStages().map((stage, index) =>
        {
            let roleName = stage.labels[0].text;
            let stageToReturn = {
                roleName: roleNameToIdFunc(roleName),
                stageNum: index,
                nextStages: [],
                stagesToWaitFor: [],
                onlineForms: [],
                attachedFilesNames: []
            };
            this.getConnections().forEach(connection =>
            {
                // connection.source.node , connection.target.node
                // figure.id
                if (connection.source.node === stage.id) {
                    let indexToPush = stages.indexOf(stages.find(_stage =>
                    {
                        return _stage.id === connection.target.node;
                    }));
                    if (indexToPush > -1) {
                        stageToReturn.nextStages.push(indexToPush);
                    }
                }
                if (connection.target.node === stage.id) {
                    let indexToPush = stages.indexOf(stages.find(_stage =>
                    {
                        return _stage.id === connection.source.node;
                    }));
                    if (indexToPush > -1) {
                        stageToReturn.stagesToWaitFor.push(indexToPush);
                    }
                }
            });
            return stageToReturn;
        });
        return stages;
    }

    getConnections()
    {
        this.sankey.content.diagram.filter((figure) =>
        {
            return figure.type === "sankey.shape.Connection";
        });
    }

    getInitials()
    {
        this.getSankeyStages().filter((figure) =>
        {
            return figure.bgColor === '#5957FF';

        }).map((figure) =>
        {
            let index;
            this.getSankeyStages().forEach((stage, _index) =>
            {
                if (stage.id === figure.id) {
                    index = _index;
                }
            });
            return index;
        });
    }
}

module.exports = processStructureSankey;