class usersAndRolesTreeSankey {

    constructor(sankey) {
        this.sankey = sankey;
    }

    getRoles() {
        return this.sankey.content.diagram.filter((figure) => {
            return figure.type === "sankey.shape.State";
        });
    }

    getConnections() {
        return this.sankey.content.diagram.filter((figure) => {
            return figure.type === "sankey.shape.Connection";
        });
    }

    getIdToRole() {
        let IdToRole = {};
        this.sankey.content.diagram.forEach((figure) => {
            if (figure.type !== "sankey.shape.Connection") {
                IdToRole[figure.id] = figure.labels[0].text;
            }
        });
        return IdToRole;
    }

    /*
        returns true if tree has at least 1 cycle, false otherwise
    */
    hasCycles() {
        let connections = this.getConnections();
        let roles = this.getRoles();
        let cycle = false;

        let DFSUtil = (v,visited) => {
            // Mark the current node as visited
            visited.push(v);

            // Recur for all the vertices adjacent to this vertex
            let neighbors = [];
            connections.forEach(connection => {
                if(connection.source.node === v){
                    neighbors.push(connection.target.node);
                }
                if(connection.target.node === v){
                    neighbors.push(connection.source.node);
                }
            });
            let counter = 0;
            neighbors.forEach(neighbor=>{
                if(!visited.includes(neighbor)){
                    DFSUtil(neighbor,visited);
                }
                else{
                    if(counter > 0){
                        cycle = true;
                    }
                    else{
                        counter++;
                    }
                }
            });
        };

        // Call the recursive helper function to print DFS traversal
        // starting from all vertices one by one
        let visited = [];
        for (let i = 0; i < roles.length; ++i) {
            let discovered = [];
            if (!visited.includes(roles[i].id)) {
                DFSUtil(roles[i].id,discovered);
                visited = visited.concat(discovered);
            }
        }

        return cycle;
    }

    /*
        returns true if 2 nodes that has more than 1 connection exists, false otherwise
    */
    hasMultipleConnections() {
        let result = false;
        this.getConnections().forEach(connection => {
            this.getConnections().forEach(_connection => {
                if (_connection.id !== connection.id) {
                    if (_connection.source.node === connection.source.node) {
                        if (_connection.target.node === connection.target.node) {
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
    hasMoreThanOneTree() {
        let connections = this.getConnections();
        let roles = this.getRoles();
        let trees = [];


        let DFSUtil = (v,visited) => {
            // Mark the current node as visited
            visited.push(v);

            // Recur for all the vertices adjacent to this vertex
            let neighbors = [];
            connections.forEach(connection => {
                if(connection.source.node === v){
                    neighbors.push(connection.target.node);
                }
                if(connection.target.node === v){
                    neighbors.push(connection.source.node);
                }
            });
            neighbors.forEach(neighbor=>{
                if(!visited.includes(neighbor)){
                    DFSUtil(neighbor,visited);
                }
            });
        };

        // Call the recursive helper function to print DFS traversal
        // starting from all vertices one by one
        let visited = [];
        for (let i = 0; i < roles.length; ++i) {
            let discovered = [];
            if (!visited.includes(roles[i].id)) {
                DFSUtil(roles[i].id,discovered);
                visited = visited.concat(discovered);
                trees.push(discovered);
            }
        }

        return trees.length > 1;
    }

    hasNoRoot() {
        return this.getRoles().length === 0;
    }

    /*
        @pre: there is at least one role in the tree
     */
    getRootName() {
        let connections = this.getConnections();
        let trees = [];
        this.getRoles().forEach((role) => {
            let result = true;
            connections.forEach((connection) => {
                if (connection.target.node === role.id) {
                    result = false;
                }
            });
            if (result) {
                trees.push(role);
            }
        });
        return trees[0].labels[0].text;
    }
}


module.exports = usersAndRolesTreeSankey;