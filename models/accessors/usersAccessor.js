let usersAndRoles = require("../schemas/usersSchemas/UsersAndRolesSchema.js");
let usersAndRolesTreeSankey = require('../schemas/usersSchemas/UsersAndRolesTreeSankeySchema.js');

let userAndRole = require('../../domainObjects/usersAndRole');

module.exports.createRole = (newRole, callback) =>
{
    return usersAndRoles.create(newRole, (err,usersAndRole)=>{
        if(err){
            callback(err);
        }
        else{
            callback(null, new usersAndRole(
                usersAndRole._id,
                usersAndRole.roleName,
                usersAndRole.userEmail,
                usersAndRole.children))
        }
    });
};

module.exports.findRole = (roleToFind, callback) =>
{
    return usersAndRoles.find(roleToFind, (err, usersAndRoles) =>
    {
        if (err) {
            callback(err);
        }
        else if(usersAndRoles.length === 0){
            callback(null, null);
        }
        else {
            callback(null, new userAndRole(
                usersAndRoles[0]._id,
                usersAndRoles[0].roleName,
                usersAndRoles[0].userEmail,
                usersAndRoles[0].children))
        }
    });
};

module.exports.deleteOneRole = (roleToDelete, callback) =>
{
    return usersAndRoles.deleteOne(roleToDelete, callback);
};

module.exports.updateRole = (roleToUpdate, update, callback) =>
{
    return usersAndRoles.updateOne(roleToUpdate, update, callback);
};

module.exports.findInSankeyTree = (toFind, callback) =>
{
    return usersAndRolesTreeSankey.find(toFind, callback);
};

module.exports.createSankeyTree = (sankeyTree, callback) =>
{
    return usersAndRolesTreeSankey.create(sankeyTree, callback);
};

module.exports.updateSankeyTree = (whatToUpdate, theUpdate, callback) =>
{
    return usersAndRolesTreeSankey.updateOne(whatToUpdate, theUpdate, callback);
};