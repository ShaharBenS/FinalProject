var User = require("../../schemas/User");
var Roles = require("../../schemas/Roles");

module.exports = (userRole, callback) => {
    Roles.find({roleName: userRole}, (err, result) => {
        if (err) {
            console.log('Error In deleteUserByRole' + err);
        }
        else {
            User.deleteMany({userRole: result}, callback)
        }
    })
};