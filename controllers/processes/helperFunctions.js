let ActiveProcess = require("../../schemas/ActiveProcessSchema");
let UsersAndRole = require("../../schemas/UsersAndRoles");
let ProcessStructure = require("../../schemas/ProcessStructure");


exports.getRoleID_by_username = function (username, callback) {
    UsersAndRole.find({userEmail: username}, (err, user) => {
        if (err) callback(err);
        else {
            if (user.length === 0) callback(null,null);
            else callback(null, user[0]._doc._id);
        }
    });
};


exports.getProcessStructure = function (processStructureName, callback) {
    ProcessStructure.find({structure_name: processStructureName}, (err, processStructure) => {
        if (err) callback(err);
        else {
            if (processStructure.length === 0) callback(null,null);
            else callback(null, processStructure[0]._doc);
        }
    });
};

exports.getActiveProcessByProcessName = function (processName, callback) {
    ActiveProcess.find({process_name: processName}, (err, process) => {
        if (err) callback(err);
        else {
            if (process.length === 0) callback(null,null);
            else callback(null,process[0]);
}
    });
};
exports.getUsernameByRoleID = (roleID, callback) => {
    UsersAndRole.find({_id: roleID}, (err1, res) => {
        if (err1) {
            callback(err1);
        }
        else {
            callback(null,res[0]._doc.userEmail[0]);
        }
    })
};