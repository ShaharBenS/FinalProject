let usersAndRoles = require("../schemas/usersSchemas/UsersAndRolesSchema.js");
let usersAndRolesTreeSankey = require('../schemas/usersSchemas/UsersAndRolesTreeSankeySchema.js');

module.exports.createRole = (newRole,callback)=>{
    return usersAndRoles.create(newRole,callback);
};

module.exports.findRole = (roleToFind, callback)=>{
    return usersAndRoles.find(roleToFind,callback);
};

module.exports.deleteAllRoles = (callback)=>{
    return usersAndRoles.deleteMany({},callback);
};


module.exports.deleteOneRole = (roleToDelete, callback)=>{
    return usersAndRoles.deleteOne(roleToDelete,callback);
};

module.exports.updateRole = (roleToUpdate,update,callback)=>{
    return usersAndRoles.updateOne(roleToUpdate,update,callback);
};

module.exports.findInSankeyTree = (toFind,callback)=>{
    return usersAndRolesTreeSankey.find(toFind,callback);
};

module.exports.createSankeyTree = (sankeyTree,callback)=>{
    return usersAndRolesTreeSankey.create(sankeyTree,callback);
};

module.exports.updateSankeyTree = (whatToUpdate, theUpdate, callback)=>{
    return usersAndRolesTreeSankey.updateOne(whatToUpdate,theUpdate,callback);
};

module.exports.findUser = (userToFind, callback)=>{
    return usersAndRoles.find(userToFind,callback);
};