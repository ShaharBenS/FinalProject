let usersPermissionsSchema = require('../schemas/usersSchemas/usersPermissionsSchema.js');
let usersPermissionsController = require('../../controllers/usersControllers/UsersPermissionsController.js');

module.exports.addPermission = (permission, callback) =>
{
    usersPermissionsSchema.create(permission, callback);
};
module.exports.findPermission = (userEmail, callback) =>
{
    usersPermissionsSchema.findOne({userEmail: userEmail}, (err,result)=>{
        if(err)
        {
            callback(err);
        }
        else
        {
            callback(null,usersPermissionsController.getPermissionObject(result));
        }
    });
};