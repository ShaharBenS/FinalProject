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
}

module.exports = usersAndRolesTreeSankey;