var UsersAndRoles = require("../../schemas/UsersAndRoles");

module.exports = (newRoleName, fatherRoleName, callback) => {
    UsersAndRoles.create({roleName: newRoleName, userEmail: [], children: []}, (err) => {
        if (err) {
            callback(err);
        }
        else {
            if (fatherRoleName.localeCompare("") !== 0) {
                UsersAndRoles.find({roleName: fatherRoleName}, (err1, result1) => {
                    if (err1) {
                        console.log('Error In AddNewRole' + err1);
                    }
                    else {
                        let fatherID = result1[0]._doc._id;
                        UsersAndRoles.find({roleName: newRoleName}, (err2, result2) => {
                            if (err2) {
                                console.log('Error In AddNewRole' + err2);
                            }
                            else {
                                let sonID = result2[0]._doc._id;
                                UsersAndRoles.updateOne({_id: fatherID}, {$push: {children: sonID}}, callback);
                            }
                        })
                    }
                })
            }
            else {
                callback(err);
            }
        }
    });
};