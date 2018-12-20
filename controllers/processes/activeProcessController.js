let ActiveProcessController = require("../../schemas/ActiveProcessSchema");
let HELPER = require("./helperFunctions.js");
let ProcessReportSchema = require("../../schemas/ProcessReportSchema");

/**
 * Starts new process from a defined structure
 *
 * @param userEmail | The userEmail that starts the process
 * @param processStructureName | The name of the structure to start
 * @param process_name | The requested name for the active process
 * @param callback
 */
module.exports.startProcessByUsername = (userEmail, processStructureName, process_name, callback) => {
    HELPER.getRoleID_by_username(userEmail, (err, roleID) => {
        if (err) {
            callback(err);
        } else {
            HELPER.getProcessStructure(processStructureName, (err, processStructure) => {
                if (err) {
                    callback(err);
                } else {
                    HELPER.getActiveProcessByProcessName(process_name, (err, activeProcesses) => {
                        if (err) {
                            callback(err);
                        } else {
                            if (!activeProcesses) {
                                let initial_stage = -1;
                                processStructure.stages.every((stage) => {
                                    let roleEqual = stage._doc.roleID.id.equals(roleID.id);
                                    let initialsInclude = processStructure.initials.includes(stage.stageNum);
                                    if (roleEqual && initialsInclude) {
                                        initial_stage = stage.stageNum;
                                        return false;
                                    }
                                    return true;
                                });
                                if (initial_stage === -1) callback(new Error(">>> ERROR: username " + userEmail + " don't have the proper role to start the process " + processStructureName));
                                getAllNewStages(0,userEmail,processStructure.stages,[],(err,newStages)=>{
                                    ActiveProcessController.create({
                                        time_creation: new Date(),
                                        current_stages: [initial_stage],
                                        process_name: process_name,
                                        initials: processStructure.initials,
                                        stages: newStages,
                                    }, callback);
                                });


                            } else {
                                callback(new Error(">>> ERROR: there is already process with the name: " + process_name));
                            }
                        }
                    });
                }
            });
        }
    });
};

const getAllNewStages = (index, initialUserEmail, stages, newStages, callback) => {
    if (stages.length === index) {
        callback(null, newStages);
    } else {
        let stage = stages[index];
        if (index === 0) {
            newStages.push({
                roleID: stage._doc.roleID,
                userEmail: initialUserEmail,
                stageNum: stage._doc.stageNum,
                nextStages: stage._doc.nextStages,
                stagesToWaitFor: stage._doc.stagesToWaitFor,
                origin_stagesToWaitFor: stage._doc.stagesToWaitFor,
                time_approval: null, //TODO: check if can be null | ORIGIN :new Date(-8640000000000000)
                online_forms: stage._doc.online_forms,
                filled_online_forms: [],
                attached_files_names: stage._doc.attached_files_names,
            });
            getAllNewStages(index + 1, initialUserEmail, stages, newStages, callback);
        } else {
            HELPER.getUsernameByRoleID(stage._doc.roleID, (err, res) => {
                newStages.push({
                    roleID: stage._doc.roleID,
                    userEmail: res,
                    stageNum: stage._doc.stageNum,
                    nextStages: stage._doc.nextStages,
                    stagesToWaitFor: stage._doc.stagesToWaitFor,
                    origin_stagesToWaitFor: stage._doc.stagesToWaitFor,
                    time_approval: null, //TODO: check if can be null | ORIGIN :new Date(-8640000000000000)
                    online_forms: stage._doc.online_forms,
                    filled_online_forms: [],
                    attached_files_names: stage._doc.attached_files_names,
                });
                getAllNewStages(index + 1, initialUserEmail, stages, newStages, callback);
            });
        }
    }
};

/**
 * return array of active processes for specific username
 *
 * @param userEmail
 * @param callback
 */
module.exports.getWaitingActiveProcessesByUser = (userEmail, callback) => {
    HELPER.getRoleID_by_username(userEmail, (err) => {
        if (err) {
            callback(err);
        } else {
            let waiting_active_processes = [];
            ActiveProcessController.find({}, (err, activeProcesses) => {
                if (err) callback(err);
                else {
                    activeProcesses.forEach((process) => {
                        let currentStages = process.current_stages;
                        process.stages.every((stage) => {
                            if (process.current_stages.includes(stage.stageNum) && stage._doc.userEmail === userEmail) {
                                waiting_active_processes.push(process);
                                currentStages.remove(stage.stageNum);
                                return currentStages.length !== 0;
                            }
                            return true;
                        });
                    });
                    callback(null, waiting_active_processes);
                }
            });
        }
    });
};

/**
 * returns all active process for specific user
 * > FOR MONITORING <
 *
 * @param userEmail
 * @param callback
 */
module.exports.getAllActiveProcessesByUser = (userEmail, callback) => {
    HELPER.getRoleID_by_username(userEmail, (err) => {
        if (err) {
            callback(err);
        } else {
            let active_processes = [];
            ActiveProcessController.find({}, (err, activeProcesses) => {
                if (err) callback(err);
                else {
                    activeProcesses.forEach((process) => {
                        process.stages.every((stage) => {
                            if (stage._doc.userEmail === userEmail) {
                                active_processes.push(process);
                            }
                            return true;
                        });
                    });
                    callback(null, active_processes);
                }
            });
        }
    });
};


/**
 * approving process and updating stages
 *
 * @param userEmail | the user that approved
 * @param process_name | the process name that approved
 * @param stageDetails | all the stage details
 * @param filledForms | the filled forms
 * @param fileNames | added files
 * @param callback
 */
module.exports.handleProcess = (userEmail, process_name, stageDetails, filledForms, fileNames, callback) => {
    HELPER.getActiveProcessByProcessName(process_name, (err, process) => {
        if (err) {
            callback(err);
        } else {
            if (process) {
                let stages = process.stages;
                let newStages = [];
                stages.forEach((stage) => {
                    if (stage.stagesToWaitFor.includes(stageDetails.stageNum)) {
                        let index = stage.stagesToWaitFor.indexOf(stageDetails.stageNum);
                        stage.stagesToWaitFor.splice(index, 1);
                    }
                    if (stage.stageNum === stageDetails.stageNum) {
                        stage.time_approval = new Date();
                        stage.filled_online_forms = stage.filled_online_forms.concat(filledForms);
                        stage.attached_files_names = stage.attached_files_names.concat(fileNames);
                        stage.comments = stageDetails.comments;
                    }
                    newStages.push(stage);
                });
                ActiveProcessController.updateOne({process_name: process_name}, {stages: stages},
                    (err, res) => {
                        if (err) callback(err);
                        else callback(null, res);
                    });
            } else {
                callback(new Error(">>> ERROR: there is already process with the name: " + process_name))
            }
        }
    });
};

/**
 * Advance process to next stage if able
 *
 * @param process_name
 * @param nextStages
 * @param callback
 */
module.exports.advanceProcess = (process_name, nextStages, callback) => {
    HELPER.getActiveProcessByProcessName(process_name, (err, process) => {
        if (err) {
            callback(err);
        } else {
            process.stages.forEach((stage) => {
                if (process.current_stages.includes(stage.stageNum)) {
                    if (stage.stagesToWaitFor.length === 0) {

                        process.current_stages = process.current_stages.concat(nextStages);
                        let index = process.current_stages.indexOf(stage.stageNum);
                        process.current_stages.splice(index, 1);
                        //remove stages
                        let graph = [];
                        let recursive_all_stages_in_path = function (stageNum) {
                            process.stages.forEach((stage) => {
                                if (stage.stageNum === stageNum) {
                                    graph.push(stageNum);
                                    stage.nextStages.forEach((iStage) => recursive_all_stages_in_path(iStage));
                                }
                            })
                        };
                        process.current_stages.forEach((stageNum) => recursive_all_stages_in_path(stageNum));

                        let stages_to_remove = [];
                        let recursive_remove_stages = function (stageNum) {
                            process.stages.forEach((stage) => {
                                if (stage.stageNum === stageNum && !graph.includes(stageNum)) {
                                    stages_to_remove.push(stageNum);
                                    stage.nextStages.forEach((iStage) => recursive_remove_stages(iStage));
                                }
                            })
                        };
                        let init_stages_to_remove = nextStages.filter(value => stage.nextStages.includes(value) === false);
                        init_stages_to_remove.forEach((stageNum) => recursive_remove_stages(stageNum));

                        let remove_stage = function (stage) {
                            let index = process.stages.indexOf(stage);
                            process.stages.splice(index, 1);
                        };

                        process.stages.forEach((stage) => {
                            if (stages_to_remove.includes(stage.stageNum)) remove_stage(stage);
                        });

                    }
                }
            });
            ActiveProcessController.updateOne({process_name: process_name}, {
                    current_stages: process.current_stages, stages: process.stages
                },
                (err, res) => {
                    if (err) callback(new Error(">>> ERROR: advance process | UPDATE"));
                    else callback(null, res);
                });
        }
    });
};

module.exports.getAllActiveProcessDetails = (processName, callback) => {
    ProcessReportSchema.find({processName : processName},(err,processReport)=>{
        let returnProcessDetails = [];
        let returnStages = [];
        returnProcessDetails.push({process_name: processReport.process_name,time_creation: processReport.time_creation, status:processReport.status});
        processReport.stages.forEach((stage)=>{
            returnStages.push({type: stage.type,roleName: stage.roleName, userEmail: stage.userEmail,
                stageNum: stage.stageNum,time_approval : stage.time_approval, comment: stage.comment,
            });
        });
        callback(null,[returnProcessDetails,returnStages]);
    });
};