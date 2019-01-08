class usersAndRolesTreeSankey{
    constructor(sankey)
    {
        this.sankey = sankey;
    }
    getRoles(){
        this.sankey.content.diagram.filter((figure) =>
        {
            return figure.type === "sankey.shape.State";
        });
    }

    getConnections()
    {
        this.sankey.content.diagram.filter((figure) =>
        {
            return figure.type === "sankey.shape.Connection";
        });
    }
}

module.exports = usersAndRolesTreeSankey;