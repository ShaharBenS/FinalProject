var Roles = require("../../schemas/Roles");

module.exports = (roleName,callback)=>{
    Roles.create({roleName:roleName},callback)
};