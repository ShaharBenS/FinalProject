let ActiveProcess = require("../../schemas/ActiveProcess");
let UsersAndRole = require("../../schemas/UsersAndRoles");
let ProcessStructure = require("../../schemas/ProcessStructure");


exports.getRoleName_by_username = function (username, callback) {
    UsersAndRole.find({userEmail: username}, (err, user) => {
        if (err) throw err;
        else {
            if (user.length === 0) throw ">>> ERROR: user " + username + " has no role";
            callback(user[0]._doc._id.id);
        }
    });
};

exports.getProcessStructure = function (processStructureName, callback) {
    ProcessStructure.find({structure_name: processStructureName}, (err, processStructure) => {
        if (err) throw err;
        else {
            if (processStructure.length === 0) throw ">>> ERROR: processStructure " + processStructure + " does not exists";
            callback(processStructure[0]._doc);
        }
    });
};

exports.getActiveProcessByProcessName = function (processName, callback) {
    ActiveProcess.find({process_name: processName}, (err, process) => {
        if (err) throw err;
        else {
            if (process.length === 0) return false;
            callback(process[0]._doc);
        }
    });
};