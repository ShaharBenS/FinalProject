let ActiveProcess = require("../../schemas/ActiveProcess");
let UsersAndRole = require("../../schemas/UsersAndRole");
let ProcessStructure = require("../../schemas/ProcessStructure");


/**
 * Starts new process from a defined structure
 *
 * @param username | The username that starts the process
 * @param processStructureName | The name of the structure to start
 * @param process_name | The requested name for the active process
 * @param callback
 */
module.exports.startProcessByUsername = (username, processStructureName, process_name, callback) => {
    let roleID = HELPER.getRoleID_by_username(username);
    let processStructure = HELPER.getProcessStructure(processStructureName);
    if (HELPER.getActiveProcessByProcessName(process_name) === false)
        throw ">>> ERROR: there is already process with the name: " + process_name;
    let stages = [];

    let initial_stage = -1;
    processStructure.stages.every((stage) => {
        if (stage.roleID === roleID && processStructure.initials.includes(stage.stageNum)) {
            initial_stage = stage.stageNum;
            return false;
        }
        return true;
    });
    if (initial_stage === -1) throw ">>> ERROR: username " + username + " don't have the proper role to start the process " + processStructureName;

    processStructure.stages.forEach((stage) => {
        stages.push({
            roleID: stage.roleID,
            userID: null, //TODO: userID is being referenced to Users, so putting null might break it.
            stageNum: stage.stageNum,
            nextStages: stage.nextStages,
            stagesToWaitFor: stage.stagesToWaitFor,
            origin_stagesToWaitFor: stage.stagesToWaitFor,
            time_approval: null, //new Date(-8640000000000000)
            online_forms: stage.online_forms,
            filled_online_forms: [],
            attached_files_names: stage.attached_files_names,
        });
    });

    ActiveProcess.create({
        time_creation: new Date(),
        current_stages: [initial_stage],
        process_name: process_name,
        initials: processStructure.initials,
        stages: [stages],
    }, callback)
};


/**
 * return array of active processes for specific username
 *
 * @param username
 * @param callback
 */
module.exports.getActiveProcessesByUser = (username, callback) => {
    let waiting_active_processes = [];
    let roleID = HELPER.getRoleID_by_username(username);
    ActiveProcess.find({}, (err, activeProcesses) => {
        if (err) console.log(err);
        else {
            activeProcesses.forEach((process) => {
                let currentStages = process.current_stages;
                process.stages.every((stage) => {
                    if (process.current_stages.includes(stage.stageNum) && stage.roleID === roleID) {
                        waiting_active_processes.push(process);
                        currentStages.remove(stage.stageNum);
                        return currentStages.length !== 0;
                    }
                });
            });
        }
    });
    callback(waiting_active_processes);
};


/**
 * approving process and updating stages
 *
 * @param username | the user that approved
 * @param process_name | the process name that approved
 * @param stageDetails | all the stage details
 * @param filledForms | the filled forms
 * @param fileNames | added files
 * @param callback
 */
module.exports.handleProcess = (username, process_name, stageDetails, filledForms, fileNames, callback) => {
    let process = HELPER.getActiveProcessByProcessName(process_name);
    if (process === false)
        throw ">>> ERROR: there is already process with the name: " + process_name;
    let stages = process.stages;
    stages.forEach((stage) => {
        if (stage.stagesToWaitFor.includes(stageDetails.stageNum)) {
            let index = stage.stagesToWaitFor.indexOf(stageDetails.stageNum);
            stage.stagesToWaitFor.splice(index, 1);
        }
        if (stage.stageNum === stageDetails.stageNum) {
            stage.time_approval = new Date();
            stage.filled_online_forms.concat(filledForms);
            stage.attached_files_names.concat(fileNames);
        }
    });
    ActiveProcess.updateOne({process_name: process_name}, {stages: stages},
        (err, res) => {
            if (err) throw ">>> ERROR: handleProcess | UPDATE";
            else callback(res);
        });
};


module.exports.advanceProcess = (process_name, nextStages) => {
    let process = HELPER.getActiveProcessByProcessName(process_name);
    process.stages.forEach((stage) => {
        if (process.current_stages.includes(stage.stageNum)) {
            if (stage.stagesToWaitFor.length() === 0) {
                if (nextStages.every((stageNum) => stage.nextStages.includes(stageNum))) {
                    process.current_stages.concat(nextStages)

                }
                else throw ">>> ERROR: invalid next stages"
            }
        }
    });
    ActiveProcess.updateOne({process_name: process_name}, {current_stages: stages},
        (err, res) => {
            if (err) throw ">>> ERROR: advance process | UPDATE";
            else callback(res);
        });
    return true;
};
