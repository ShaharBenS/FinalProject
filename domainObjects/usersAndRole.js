
class usersAndRole{
    _id;
    roleName;
    userEmail;
    children;

    constructor(_id, roleName, userEmail, children)
    {
        this._id = _id;
        this.roleName = roleName;
        this.userEmail = userEmail;
        this.children = children;
    }
}
export {usersAndRole};