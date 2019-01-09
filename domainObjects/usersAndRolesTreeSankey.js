class usersAndRolesTreeSankey{

    constructor(sankey)
    {
        this.sankey = sankey;
    }

    getRoles(){
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
}

module.exports = usersAndRolesTreeSankey;