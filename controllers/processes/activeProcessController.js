let ActiveProcessSchema = require("../../schemas/ActiveProcessSchema");
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
                                    let roleEqual = stage.roleID.id.equals(roleID.id);
                                    let initialsInclude = processStructure.initials.includes(stage.stageNum);
                                    if (roleEqual && initialsInclude) {
                                        initial_stage = stage.stageNum;
                                        return false;
                                    }
                                    return true;
                                });
                                if (initial_stage === -1)
                                {
                                    callback(new Error(">>> ERROR: username " + userEmail + " don't have the proper role to start the process " + processStructureName));
                                    return;
                                }
                                let newStages = [];
                                processStructure.stages.forEach((stage) => {
                                    newStages.push({
                                        roleID: stage.roleID,
                                        userEmail: stage.stageNum === initial_stage ? userEmail : null,
                                        stageNum: stage.stageNum,
                                        nextStages: stage.nextStages,
                                        stagesToWaitFor: stage.stagesToWaitFor,
                                        origin_stagesToWaitFor: stage.stagesToWaitFor,
                                        time_approval: null, //TODO: check if can be null | ORIGIN :new Date(-8640000000000000)
                                        online_forms: stage.online_forms,
                                        filled_online_forms: [],
                                        attached_files_names: stage.attached_files_names,
                                    });
                                });
                                let today = new Date();
                                ActiveProcessSchema.create({
                                    time_creation: today,
                                    current_stages: [initial_stage],
                                    process_name: process_name,
                                    initials: processStructure.initials,
                                    stages: newStages,
                                }, (err)=>{
                                    if(err) callback(err);
                                    else addProcessReport(process_name,today,callback);
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

/**
 * return array of active processes for specific username
 *
 * @param userEmail
 * @param callback
 */
module.exports.getWaitingActiveProcessesByUser = (userEmail, callback) => {
    HELPER.getRoleID_by_username(userEmail, (err, roleID) => {
        if (err) {
            callback(err);
        } else {
            let waiting_active_processes = [];
            ActiveProcessSchema.find({}, (err, activeProcesses) => {
                if (err) callback(err);
                else {
                    activeProcesses.forEach((process) => {
                        let currentStages = process.current_stages;
                        process.stages.every((stage) => {
                            if (process.current_stages.includes(stage.stageNum) && stage.roleID.id.equals(roleID.id) && (stage.userEmail === null || stage.userEmail === userEmail)) {
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
            ActiveProcessSchema.find({}, (err, activeProcesses) => {
                if (err) callback(err);
                else {
                    activeProcesses.forEach((process) => {
                        process.stages.every((stage) => {
                            if (stage.userEmail === userEmail) {
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
                let today = null;
                stages.forEach((stage) => {
                    if (stage.stagesToWaitFor.includes(stageDetails.stageNum)) {
                        let index = stage.stagesToWaitFor.indexOf(stageDetails.stageNum);
                        stage.stagesToWaitFor.splice(index, 1);
                    }
                    if (stage.stageNum === stageDetails.stageNum) {
                        today = new Date();
                        stage.time_approval = today;
                        stage.filled_online_forms = stage.filled_online_forms.concat(filledForms);
                        stage.attached_files_names = stage.attached_files_names.concat(fileNames);
                        stage.comments = stageDetails.comments;
                    }
                    newStages.push(stage);
                });
                ActiveProcessSchema.updateOne({process_name: process_name}, {stages: stages},
                    (err, res) => {
                        if (err) callback(err);
                        else {
                            addActiveProcessDetailsToReport(process_name,userEmail,stages.stageNum,today,stageDetails.comments,(err)=>{
                                if(err) callback(err);
                                else
                                {
                                    advanceProcess(process_name, stageDetails.nextStages, callback);
                                }
                            });
                        }
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
const advanceProcess = (process_name, nextStages, callback) => {
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
            ActiveProcessSchema.updateOne({process_name: process_name}, {
                    current_stages: process.current_stages, stages: process.stages
                },
                (err, res) => {
                    if (err) callback(new Error(">>> ERROR: advance process | UPDATE"));
                    else callback(null, res);
                });
        }
    });
};

const addProcessReport = (process_name,time_creation,callback)=>{
      ProcessReportSchema.create({process_name: process_name,status: 'activated',time_creation: time_creation, stages:[]},(err)=>{
          if(err) callback(err);
          else callback(null);
      });
};
const addActiveProcessDetailsToReport = (process_name,userEmail,stageNum,time_approval,comments,callback)=>{
    ProcessReportSchema.findOne({process_name: process_name},(err,processReport)=>{
        if(err) callback(err);
        else
        {
            HELPER.getRoleID_by_username(userEmail,(err,roleID)=>{
                if(err) callback(err);
                else
                {
                    let newStage = {roleID: roleID, userEmail: userEmail, stageNum: stageNum, time_approval:time_approval,
                        comments: comments};
                    let stages = [];
                    processReport.stages.forEach((stage)=>{
                        stages.push({roleID: stage.roleID, userEmail: stage.userEmail, stageNum: stage.stageNum, time_approval: stage.time_approval,
                            comments: stage.comments})
                    });
                    stages.push(newStage);
                    ProcessReportSchema.updateOne({process_name: process_name},{stages:stages},(err)=>{
                        if(err) callback(err);
                        else callback(null);
                    });
                }
            });
        }
    });
};
module.exports.getAllActiveProcessDetails = (process_name, callback) => {
    ProcessReportSchema.findOne({process_name: process_name}, (err, processReport) => {
        if(err) callback(err);
        else
        {
            let returnProcessDetails = {process_name: processReport.process_name, time_creation: processReport.time_creation,
                status: processReport.status
            };
            returnStagesWithRoleName(0,processReport.stages,[],(err,newStages)=>{
                callback(null, [returnProcessDetails, newStages]);
            });
        }
    });
};

const returnStagesWithRoleName = (index,stages,newStages,callback) =>{
    if(index === stages.length)
    {
        callback(null,newStages);
    }
    else
    {
        let stage = stages[index];
        HELPER.getRoleName_by_RoleID(stage.roleID,(err,roleName)=>{
            if(err) callback(err);
            else
            {
                newStages.push({roleID: roleName, userEmail: stage.userEmail,
                    stageNum: stage.stageNum, time_approval: stage.time_approval, comments: stage.comments
                });
                returnStagesWithRoleName(index+1,stages,newStages,callback);
            }
        });
    }
};

module.exports.takePartInActiveProcess = (process_name,userEmail,callback)=>{
    HELPER.getActiveProcessByProcessName(process_name,(err,process)=>{
        if(err) callback(err);
        else
        {
            HELPER.getRoleID_by_username(userEmail,(err,roleID)=>{
                if(err) callback(err);
                else
                {
                    let newStages = [];
                    process.stages.forEach((stage)=>{
                        newStages.push(
                            {roleID: stage.roleID,
                                userEmail: (process.current_stages.includes(stage.stageNum) && stage.roleID.id.equals(roleID.id)?userEmail:stage.userEmail),
                                stageNum: stage.stageNum,
                                nextStages: stage.nextStages,
                                stagesToWaitFor: stage.stagesToWaitFor,
                                origin_stagesToWaitFor: stage.origin_stagesToWaitFor,
                                time_approval: stage.time_approval,
                                online_forms: stage.online_forms,
                                filled_online_forms: stage.filled_online_forms,
                                attached_files_names: stage.attached_files_names,
                                comments: stage.comments});
                    });
                    ActiveProcessSchema.updateOne({process_name: process_name}, {stages: newStages}, callback);
                }
            });
        }
    });
};

module.exports.unTakePartInActiveProcess = (process_name,userEmail,callback)=>{
    HELPER.getActiveProcessByProcessName(process_name,(err,process)=>{
        if(err) callback(err);
        else
        {
            let newStages = [];
            process.stages.forEach((stage)=>{
                newStages.push(
                    {roleID: stage.roleID,
                        userEmail: (process.current_stages.includes(stage.stageNum) && stage.userEmail === userEmail ? null:stage.userEmail),
                        stageNum: stage.stageNum,
                        nextStages: stage.nextStages,
                        stagesToWaitFor: stage.stagesToWaitFor,
                        origin_stagesToWaitFor: stage.origin_stagesToWaitFor,
                        time_approval: stage.time_approval,
                        online_forms: stage.online_forms,
                        filled_online_forms: stage.filled_online_forms,
                        attached_files_names: stage.attached_files_names,
                        comments: stage.comments});
            });
            ActiveProcessSchema.updateOne({process_name: process_name}, {stages: newStages}, callback);
        }
    });
};

