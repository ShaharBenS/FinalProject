class usersAndRolesTreeSankey
{

    constructor(sankey)
    {
        this.sankey = sankey;
    }

    getRoles()
    {
        return this.sankey.content.diagram.filter((figure) =>
        {
            return figure.type === "sankey.shape.State";
        });
    }

    getConnections()
    {
        return this.sankey.content.diagram.filter((figure) =>
        {
            return figure.type === "sankey.shape.Connection";
        });
    }

    getIdToRole()
    {
        let IdToRole = {};
        this.sankey.content.diagram.forEach((figure) =>
        {
            if(figure.type !== "sankey.shape.Connection"){
                IdToRole[figure.id] = figure.labels[0].text;
            }
        });
        return IdToRole;
    }

    /*
        returns true if tree has at least 1 cycle, false otherwise
    */
    hasCycles(){
        let connections = this.getConnections();
        let trees = [];
        this.getRoles().forEach((role)=>{
            let result = true;
            connections.forEach((connection)=>{
                if(connection.target.node === role.id){
                    result = false;
                }
            });
            if(result){
                trees.push(role.id);
            }
        });

        var isCyclic = function (stack,node_id){
            stack.push(node_id);
            let result = !connections.every((connection)=>{
                if(connection.source.node ===  node_id){
                    if(stack.includes(connection.target.node)){
                        return false;
                    }
                    else{
                        return !isCyclic(stack,connection.target.node);
                    }
                }
                return true;
            });
            stack.pop();
            return result;
        };

        return !this.getRoles().every((role)=>{
            if(trees.includes(role.id)){
                //Start scanning the tree from this root
                return !isCyclic([], role.id);

            }
            return true;
        });
    }

    /*
        returns true if 2 nodes that has more than 1 connection exists, false otherwise
    */
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

    /*
        returns true if sankey graph contains 2 or more trees, true otherwise
    */
    hasMoreThanOneTree(){
        let connections = this.getConnections();
        let trees = 0;
        this.getRoles().forEach((role)=>{
            let result = true;
            connections.forEach((connection)=>{
                if(connection.target.node === role.id){
                    result = false;
                }
            });
            if(result){
                trees++;
            }
        });
        return trees > 1;
    }

    hasNoRoot()
    {
        return this.getRoles().length === 0;
    }
    /*
        @pre: there is at least one role in the tree
     */
    getRootName()
    {
        let connections = this.getConnections();
        let trees = [];
        this.getRoles().forEach((role)=>{
            let result = true;
            connections.forEach((connection)=>{
                if(connection.target.node === role.id){
                    result = false;
                }
            });
            if(result){
                trees.push(role);
            }
        });
        return trees[0].labels[0].text;
    }
}


module.exports = usersAndRolesTreeSankey;