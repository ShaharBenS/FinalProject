var User = require("../../schemas/User");

module.exports = (userRole,callback)=>{
    User.deleteOne({userRole:userRole},callback)
};