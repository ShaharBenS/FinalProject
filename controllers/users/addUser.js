var User = require("../../schemas/User");
var Roles = require("../../schemas/Roles");

module.exports = (userEmail, userRole, callback) => {
    Roles.find({roleName: userRole}, (err, result) => {
        if (err) {
            console.log('Error In AddUser' + err);
        }
        else {
            User.create({userEmail: userEmail, userRole: result[0]._doc._id}, callback)
        }
    })
};