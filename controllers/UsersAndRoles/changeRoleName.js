var UsersAndRoles = require("../../schemas/UsersAndRoles");

module.exports = (oldRoleName, newRoleName, callback) => {
    UsersAndRoles.find({roleName: oldRoleName}, (err1, result1) => {
        if (err1) {
            console.log('Error In deleteRole' + err1);
        }
        else {
            let toChangeID = result1[0]._doc._id;
            UsersAndRoles.updateOne({_id: toChangeID}, {roleName: newRoleName}, callback)
        }
    })
};