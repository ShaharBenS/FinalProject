let ActiveProcess = require("../../schemas/ActiveProcess");
let UsersAndRole = require("../../schemas/UsersAndRole");
let ProcessStructure = require("../../schemas/ProcessStructure");


exports.getRoleName_by_username = function (username) {
    UsersAndRole.find({userEmail: username}, (err, user) => {
        if (err) throw err;
        else {
            if (user.length === 0) throw ">>> ERROR: user " + username + " has no role";
            return user[0].roleName;
        }
    });
};

exports.getProcessStructure = function (processStructureName) {
    ProcessStructure.find({structure_name: processStructureName}, (err, processStructure) => {
        if (err) throw err;
        else {
            if (processStructure.length === 0) throw ">>> ERROR: processStructure " + processStructure + " does not exists";
            return processStructure[0];
        }
    });
};

exports.getActiveProcessByProcessName = function (processName) {
    ActiveProcess.find({process_name: processName}, (err, process) => {
        if (err) throw err;
        else {
            if (process.length === 0) return false;
            return process[0];
        }
    });
};