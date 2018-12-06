var User = require("../../schemas/User");

module.exports = (userEmail,callback)=>{
    User.deleteOne({userEmail:userEmail},callback)
};