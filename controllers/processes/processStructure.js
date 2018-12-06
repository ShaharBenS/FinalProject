let ProcessStructure = require("../../schemas/ProcessStructure");

module.exports.addStructure = (username,password,callback)=>{
    User.create({
        username:username,
        password:password,
    },callback)
};