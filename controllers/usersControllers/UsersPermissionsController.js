let userPermissionsAccessor = require('../../models/accessors/usersPermissionsAccessor');
let userAccessor = require('../../models/accessors/usersAccessor');
let UserPermissions = require('../../domainObjects/UserPermissions');

module.exports.setUserPermissions = function (requestingUserEmail, userPermissions, callback) {
    userAccessor.findAdmins({userEmail: userPermissions.userEmail}, (err, results) => {
        if (err) {
            callback(err);
        }
        else if (results.length === 0) {
            this.getUserPermissions(requestingUserEmail, (err, permissionsFromDB) => {
                if (err) callback(err);
                else {
                    if (permissionsFromDB.permissionsManagementPermission === true) {
                        this.getUserPermissions(userPermissions.userEmail, (err, res) => {
                            if (err) {
                                callback(err);
                            }
                            else {
                                if (res.atLeastOneTruePermission()) {
                                    if (userPermissions.atLeastOneTruePermission()) {
                                        userPermissionsAccessor.updateUserPermission(userPermissions.userEmail, userPermissions.getPermissionsArray(), callback);
                                    }
                                    else {
                                        userPermissionsAccessor.removeUserPermissions(userPermissions.userEmail, callback);
                                    }
                                }
                                else {
                                    if (userPermissions.atLeastOneTruePermission()) {
                                        userPermissionsAccessor.addUserPermissions(userPermissions.userEmail, userPermissions.getPermissionsArray(), (err1) => {
                                            if (err1) callback(err1);
                                            else {
                                                callback(null);
                                            }
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }
                                }
                            }
                        });
                    }
                    else {
                        callback(new Error('user isnt authorized to grant permissions'));
                    }
                }
            });
        }
        else {
            callback(new Error("Can't change the permissions of an admin"))
        }
    });
};

module.exports.getUserPermissions = function (userEmail, callback) {
    userAccessor.findAdmins({userEmail: userEmail}, (err, results) => {
        if (err) {
            callback(err);
        }
        else
        {
            if (results.length === 0) {
                userPermissionsAccessor.findUserPermissions(userEmail, (err, result) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        if (result) {
                            callback(null, new UserPermissions(userEmail, result.permissions));
                        }
                        else {
                            callback(null, new UserPermissions(userEmail));
                        }
                    }
                });
            }
            else
            {
                callback(null, new UserPermissions(userEmail, [true,true,true,true]));
            }
        }
    });
};