var UsersAndRoles = require("../../schemas/UsersAndRoles");

module.exports = (roleToDelete, callback) => {
    UsersAndRoles.find({roleName: roleToDelete}, (err1, result1) => {
        if (err1) {
            console.log('Error In deleteRole' + err1);
        }
        else {
            let toDeleteID = result1[0]._doc._id;
            let toDeleteChildren = result1[0]._doc.children;
            UsersAndRoles.find({children: toDeleteID}, (err2, result2) => {
                if (err2) {
                    console.log('Error In deleteRole' + err2);
                }
                else {
                    if (result2.length !== 0) {
                        let fatherID = result2[0]._doc._id;
                        UsersAndRoles.updateOne({_id: fatherID}, {$pull: {children: toDeleteID}}, (err3) => {
                                if (err3) {
                                    console.log('Error In deleteRole' + err3);
                                }
                                else {
                                    UsersAndRoles.updateOne({_id: fatherID},  { $push: { children: { $each: toDeleteChildren }}}, (err4) => {
                                            if (err4) {
                                                console.log('Error In deleteRole' + err4);
                                            }
                                            else {
                                                UsersAndRoles.deleteOne({_id: toDeleteID}, callback)
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                }
            });
        }
    })
};