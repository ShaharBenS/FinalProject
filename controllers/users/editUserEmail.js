var User = require("../../schemas/User");

module.exports = (oldUserEmail,newUserEmail,callback)=>{User.updateOne({userEmail:oldUserEmail},{userEmail:newUserEmail},callback)};