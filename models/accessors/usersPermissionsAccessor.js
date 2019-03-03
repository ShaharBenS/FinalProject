let usersPermissionsSchema = require('../schemas/usersSchemas/usersPermissionsSchema.js');
let UserPermissions = require('../../domainObjects/UserPermissions');

module.exports.addUserPermissions = (userEmail, userPermissions, callback) =>
{
    usersPermissionsSchema.create({userEmail: userEmail, permissions: userPermissions}, callback);
};

module.exports.findUserPermissions = (userEmail, callback) =>
{
    usersPermissionsSchema.findOne({userEmail: userEmail}, (err,result)=>{
        if(err)
        {
            callback(err);
        }
        else
        {
            if (result)
            {
                callback(null,new UserPermissions(userEmail,result.permissions));
            }
            else
            {
                callback(null,new UserPermissions(userEmail));
            }
        }
    });
};

module.exports.updateUserPermission = (userEmail, userPermissions, callback) =>
{
    usersPermissionsSchema.updateOne({userEmail: userEmail}, { $set: {permissions: userPermissions} }, callback);
};

module.exports.removeUserPermissions = (userEmail, callback) =>
{
    usersPermissionsSchema.deleteOne({userEmail: userEmail}, callback);
};