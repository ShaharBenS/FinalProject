var UsersAndRoles = require("../../schemas/UsersAndRoles");

module.exports = (roleName, oldUserEmail, newUserEmail, callback) => {
    UsersAndRoles.find({roleName: roleName}, (err1, result1) => {
        if (err1) {
            console.log('Error In Add New User To Role' + err1);
        }
        else {
            let toChangeID = result1[0]._doc._id;
            UsersAndRoles.updateOne({_id: toChangeID}, {$pull: {userEmail: oldUserEmail}}, (err2) => {
                    if (err2) {
                        console.log('Error In Add New User To Role' + err2);
                    }
                    else {
                        UsersAndRoles.updateOne({_id: toChangeID}, {$push: {userEmail: newUserEmail}}, callback)
                    }
                }
            )
        }
    })
};