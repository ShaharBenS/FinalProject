class processStructureSankey {
    constructor(sankey) {
        this.sankey = sankey;
    }

    getSankeyStages() {
        return this.sankey.content.diagram.filter((figure) => {
            return figure.type !== "sankey.shape.Connection";
        });
    }

    getStages(roleNameToIdFunc) {
        let sankeyStages = this.getSankeyStages();
        return sankeyStages.map((stage, index) => {
            let roleName = stage.labels[0].text;
            let kind = '';
            let roleID = undefined;
            let dereg = undefined;
            let aboveCreatorNumber = -1;
            if(stage.bgColor.toLowerCase() === "#ff9d6d"){
                if(roleName === "יוצר התהליך"){
                    kind = "Creator";
                }
                else{
                    kind = "AboveCreator";
                    aboveCreatorNumber = Number(roleName.substring(roleName.indexOf(":")+1,roleName.length));
                }
            }
            else{
                if(stage.bgColor.toLowerCase() !== "#f6a500"){
                    kind = "ByDereg";
                    dereg = stage.bgColor[6];
                }
                else{
                    kind = "ByRole";
                    roleID = roleNameToIdFunc(roleName);
                }
            }
            let stageToReturn = {
                kind: kind,
                roleID: roleID,
                dereg: dereg,
                aboveCreatorNumber: aboveCreatorNumber,
                stageNum: index,
                nextStages: [],
                stagesToWaitFor: [],
            };
            this.getConnections().forEach(connection => {
                // connection.source.node , connection.target.node
                // figure.id
                if (connection.source.node === stage.id) {
                    let indexToPush = sankeyStages.indexOf(sankeyStages.find(_stage => {
                        return _stage.id === connection.target.node;
                    }));
                    if (indexToPush > -1) {
                        stageToReturn.nextStages.push(indexToPush);
                    }
                }
                if (connection.target.node === stage.id) {
                    let indexToPush = sankeyStages.indexOf(sankeyStages.find(_stage => {
                        return _stage.id === connection.source.node;
                    }));
                    if (indexToPush > -1) {
                        stageToReturn.stagesToWaitFor.push(indexToPush);
                    }
                }
            });
            return stageToReturn;
        });
    }

    getConnections()
    {
        return this.sankey.content.diagram.filter((figure) =>
        {
            return figure.type === "sankey.shape.Connection";
        });
    }

    hasMoreThanOneFlow(){
        let connections = this.getConnections();
        let flows = 0;
        this.getSankeyStages().forEach((role)=>{
            let result = true;
            connections.forEach((connection)=>{
                if(connection.target.node === role.id){
                    result = false;
                }
            });
            if(result){
                flows++;
            }
        });
        return flows > 1;
    }

    hasMultipleConnections(){
        let result = false;
        this.getConnections().forEach(connection=>{
            this.getConnections().forEach(_connection=>{
                if(_connection.id !== connection.id){
                    if(_connection.source.node === connection.source.node){
                        if(_connection.target.node === connection.target.node){
                            result = true;
                        }
                    }
                }
            })
        });
        return result;
    }

    hasCycles(){
        let connections = this.getConnections();
        let stages = this.getSankeyStages();

        let isCyclicUtil = (i, visited, recStack)=>
        {
            // Mark the current node as visited and
            // part of recursion stack
            if (recStack.includes(i))
                return true;

            if (visited.includes(i))
                return false;

            visited.push(i);
            recStack.push(i);

            let neighbors = [];
            connections.forEach(connection => {
                if (connection.source.node === i) {
                    neighbors.push(connection.target.node);
                }
            });

            for (let j = 0; j < neighbors.length; j++)
            {
                if (isCyclicUtil(neighbors[j], visited, recStack))
                    return true;
            }

            recStack.pop();
            return false;
        };

        let isCyclic = ()=>
        {
            let visited =[];
            let recStack = [];


            for (let i = 0; i < stages.length; i++)
            {
                if (isCyclicUtil(stages[i].id, visited, recStack)) {
                    return true;
                }
            }

            return false;
        };

        return isCyclic();
    }

    hasNoStages()
    {
        return this.getSankeyStages().length === 0;

    }

    setStageToNotFound(id){
        this.getSankeyStages().forEach(stage=>{
            if(stage.id===id){
                stage.bgColor = "#ff1100";
            }
        })
    }

    sankeyToString(){
        return JSON.stringify(this.sankey);
    }

    changeStageName(id, renamedRole)
    {
        this.getSankeyStages().forEach(stage=>{
            if(stage.id === id){
                stage.labels[0].text = renamedRole;
            }
        })
    }
}

module.exports = processStructureSankey;