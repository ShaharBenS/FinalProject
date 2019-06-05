class UserPermissions {

    constructor(userEmail, permissionsArray) {
        this._userEmail = userEmail;
        this._usersManagementPermission = permissionsArray?permissionsArray[0]:false;
        this._structureManagementPermission = permissionsArray?permissionsArray[1]:false;
        this._observerPermission = permissionsArray?permissionsArray[2]:false;
        this._permissionsManagementPermission = permissionsArray?permissionsArray[3]:false;
    }

    get userEmail() {
        return this._userEmail;
    }

    set userEmail(value) {
        this._userEmail = value;
    }

    get usersManagementPermission() {
        return this._usersManagementPermission;
    }

    set usersManagementPermission(value) {
        this._usersManagementPermission = value;
    }

    get structureManagementPermission() {
        return this._structureManagementPermission;
    }

    set structureManagementPermission(value) {
        this._structureManagementPermission = value;

    }

    get observerPermission() {
        return this._observerPermission;
    }

    set observerPermission(value) {
        this._observerPermission = value;
    }

    get permissionsManagementPermission() {
        return this._permissionsManagementPermission;
    }

    set permissionsManagementPermission(value) {
        this._permissionsManagementPermission = value;
    }

    getPermissionsArray(){
        return [this._usersManagementPermission, this._structureManagementPermission, this._observerPermission,
            this._permissionsManagementPermission];
    }

    atLeastOneTruePermission(){
        return this._usersManagementPermission === true || this._structureManagementPermission === true
            || this._observerPermission === true || this._permissionsManagementPermission === true;

    }
}

module.exports = UserPermissions;
