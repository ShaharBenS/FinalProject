let userPermissionsAccessor = require('../../models/accessors/usersPermissionsAccessor');
let userAccessor = require('../../models/accessors/usersAccessor');

module.exports.setUserPermissions = function (userPermissions, callback)
{
    userAccessor.findAdmins({userEmail: userPermissions.userEmail}, (err, results) =>
    {
        if (err) {
           callback(err);
        }
        else if(results.length === 0){
            userPermissionsAccessor.findUserPermissions(userPermissions.userEmail, (err, res) =>
            {
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
                            userPermissionsAccessor.addUserPermissions(userPermissions.userEmail, userPermissions.getPermissionsArray(), (err1) =>
                            {
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
        else{
            callback(new Error("Can\'t change the permissions of an admin"))
        }
    });
};

module.exports.getUserPermissions = function (userEmail, callback)
{
    userPermissionsAccessor.findUserPermissions(userEmail, callback);
};