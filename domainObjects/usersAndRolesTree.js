class usersAndRolesTree{

    constructor(usersAndRoles)
    {
        this.usersAndRoles = usersAndRoles;
    }
    getRoleToEmails(){
        return this.usersAndRoles.reduce((acc, role) =>
        {
            acc[role.roleName] = role.userEmail;
            return acc;
        }, {})
    }
}

module.exports = usersAndRolesTree;