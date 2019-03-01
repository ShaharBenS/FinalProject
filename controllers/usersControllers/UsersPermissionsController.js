let UserPermissions = require('../../domainObjects/UserPermissions');

module.exports.getPermissionObject = function (permissionFromDb)
{
    return new UserPermissions(permissionFromDb.permissions[0], permissionFromDb.permissions[1], permissionFromDb.permissions[2]);
};