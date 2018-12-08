let ActiveProcess = require("../../schemas/ActiveProcess");
let UsersAndRole = require("../../schemas/UsersAndRole");
let ProcessStructure = require("../../schemas/ProcessStructure");


export function getRoleID_by_username(username) {
    UsersAndRole.find({userID: username}, (err, user) => {
        if (err) throw err;
        else {
            if (user.length === 0) throw ">>> ERROR: user " + username + " has no role";
            return user[0].roleName;
        }
    });
}

export function getProcessStructure(processStructureName) {
    ProcessStructure.find({structure_name: processStructureName}, (err, processStructure) => {
        if (err) throw err;
        else {
            if (processStructure.length === 0) throw ">>> ERROR: processStructure " + processStructure + " does not exists";
            return processStructure[0];
        }
    });
}

export function getActiveProcessByProcessName(processName) {
    ActiveProcess.find({process_name: processName}, (err, process) => {
        if (err) throw err;
        else {
            if (process.length === 0) return false;
            return process[0];
        }
    });
}