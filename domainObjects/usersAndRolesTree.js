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

    getIdByRoleName(roleName){
        let index = this.usersAndRoles.findIndex(usersAndRole=>{
            return usersAndRole.roleName === roleName;

        });
        return index > -1 ? this.usersAndRoles[index]._id : undefined;
    }
}

module.exports = usersAndRolesTree;