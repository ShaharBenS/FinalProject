var UsersAndRoles = require("../../schemas/UsersAndRoles");

module.exports = (userEmail, roleName, callback) => {
    UsersAndRoles.find({roleName: roleName}, (err1, result1) => {
        if (err1) {
            console.log('Error In Add New User To Role' + err1);
        }
        else {
            let toChangeID = result1[0]._doc._id;
            UsersAndRoles.updateOne({_id: toChangeID}, {$push: {userEmail: userEmail}}, callback);
        }
    })
};