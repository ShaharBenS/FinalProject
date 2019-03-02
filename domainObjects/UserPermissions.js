class UserPermissions {

    constructor(userEmail, permissionsArray) {
        this._userEmail = userEmail;
        this._usersManagementPermission = permissionsArray[0];
        this._structureManagementPermission = permissionsArray[1];
        this._observerPermission = permissionsArray[2];
        this._permissionsManagementPermission = permissionsArray[3];
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
            || this._observerPermission === true;

    }
}

module.exports = UserPermissions;
