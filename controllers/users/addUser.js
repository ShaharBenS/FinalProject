var User = require("../../schemas/User");

module.exports = (userEmail,userRole,callback)=>{
    User.create({
        userEmail:userEmail,
        userRole:userRole,
    },callback)
};
