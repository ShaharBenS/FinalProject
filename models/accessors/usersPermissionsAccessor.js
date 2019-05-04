let usersPermissionsSchema = require('../schemas/usersSchemas/usersPermissionsSchema.js');

module.exports.addUserPermissions = (userEmail, userPermissions, callback) =>
{
    usersPermissionsSchema.create({userEmail: userEmail, permissions: userPermissions}, callback);
};

module.exports.findUserPermissions = (userEmail, callback) =>
{
    usersPermissionsSchema.findOne({userEmail: userEmail}, callback);
};

module.exports.updateUserPermission = (userEmail, userPermissions, callback) =>
{
    usersPermissionsSchema.updateOne({userEmail: userEmail}, { $set: {permissions: userPermissions} }, callback);
};

module.exports.removeUserPermissions = (userEmail, callback) =>
{
    usersPermissionsSchema.deleteOne({userEmail: userEmail}, callback);
};