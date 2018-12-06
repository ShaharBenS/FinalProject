var Roles = require("../../schemas/Roles");

module.exports = (roleName,callback)=>{
    Roles.deleteOne({roleName:roleName},callback)
};