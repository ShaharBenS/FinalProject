var User = require("../../schemas/User");

module.exports = (userEmail,oldUserRole,newUserRole,callback)=>{User.updateOne({userRole:oldUserRole},{userRole:newUserRole},callback)};