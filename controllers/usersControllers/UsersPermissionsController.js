let userPermissionsAccessor = require('../../models/accessors/usersPermissionsAccessor');
module.exports.setUserPermissions = function (userPermissions,callback)
{
    userPermissionsAccessor.findUserPermissions(userPermissions.userEmail,(err,res)=>{
        if(err)
        {
            callback(err);
        }
        else
        {
            if(res.atLeastOneTruePermission())
            {
                if(userPermissions.atLeastOneTruePermission())
                {
                    userPermissionsAccessor.updateUserPermission(userPermissions.userEmail,userPermissions.getPermissionsArray(),callback);
                }
                else
                {
                    userPermissionsAccessor.removeUserPermissions(userPermissions.userEmail,callback);
                }
            }
            else
            {
                if(userPermissions.atLeastOneTruePermission()) {
                    userPermissionsAccessor.addUserPermissions(userPermissions.userEmail, userPermissions.getPermissionsArray(), (err1) => {
                        if (err1) callback(err1);
                        else {
                            callback(null);
                        }
                    });
                }
                else
                {
                    callback(null);
                }
            }
        }
    });
};

module.exports.getUserPermissions = function (userEmail,callback)
{
    userPermissionsAccessor.findUserPermissions(userEmail,callback);
};