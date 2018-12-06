var Roles = require("../../schemas/Roles");

module.exports = (oldRoleName,newRoleName,callback)=>{
    Roles.updateOne({roleName:oldRoleName},{roleName:newRoleName},callback)
};