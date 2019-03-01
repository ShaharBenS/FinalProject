class UserPermissions {

    constructor(usersPermission, structurePermission,observerPermission) {
        this._usersPermission = usersPermission;
        this._structurePermission = structurePermission;
        this._observerPermission = observerPermission;
    }

    get usersPermission() {
        return this._usersPermission;
    }

    set usersPermission(value) {
        this._usersPermission = value;
    }

    get structurePermission() {
        return this._structurePermission;
    }

    set structurePermission(value) {
        this._structurePermission = value;

    }

    get observerPermission() {
        return this._observerPermission;
    }

    set currentStages(value) {
        this._observerPermission = value;
    }
}

module.exports = UserPermissions;
