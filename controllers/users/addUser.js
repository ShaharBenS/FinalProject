var User = require("../../schemas/User");

module.exports = (username,password,callback)=>{
    User.create({
        username:username,
        password:password,
    },callback)
};
