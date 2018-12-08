var User = require("../../schemas/User");
var Roles = require("../../schemas/Roles");

module.exports = (oldUserRole, newUserRole, callback) => {
    Roles.find({roleName: oldUserRole}, (err1, result1) => {
        if (err1) {
            console.log('Error In editUserRole' + err1);
        }
        else {
            Roles.updateOne({roleName: oldUserRole}, {roleName: newUserRole}, callback)
            Roles.find({roleName: newUserRole}, (err2, result2) => {
                if (err2) {
                    console.log('Error In editUserRole' + err2);
                }
                else {
                    User.updateOne({userRole: result1}, {userRole: result1[0]._doc._id.id}, callback)
                }
            })
        }
    })
};