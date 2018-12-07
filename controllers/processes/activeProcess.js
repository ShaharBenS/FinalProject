let ActiveProcess = require("../../schemas/ActiveProcess");
let ProcessStructure = require("../../schemas/ProcessStructure");

module.exports.activateProcess = (structure_name,process_name,initial_stage, callback)=>{
    ProcessStructure.find({structure_name:structure_name},(err,result)=>{
        if(err || result.length === 0){
            console.log(err);
        }
        else{
            let stages = [];
            result[0].forEach((stage)=>{
               stages.push({
                   roleID: stage.roleID,
                   userID: null, //TODO: userID is being referenced to Users, so putting null might break it.
                   condition: stage.condition,
                   nextStages: stage.nextStages,
                   stagesToWaitFor: stage.stagesToWaitFor,
                   origin_stagesToWaitFor: stage.origin_stagesToWaitFor,
                   time_approval: new Date(-8640000000000000),
                   online_forms: stage.online_forms,
                   filled_online_forms: stage.filled_online_forms,
                   attached_files_names: stage.attached_files_names,
               });
            });

            ActiveProcess.create({
                time_creation: new Date(),
                current_stages: [initial_stage],
                process_name: process_name,
                initials: result[0].initials,
                stages: [result[0].stages],
            },callback)
        }
    });

};

module.exports.getActiveProcessesByUser = (user_name, callback)=>{
    let toReturn =[];
    activeProcess.find().foreach(function(activeP)
    {
        activeP.current_stages.forEach(function (currentStage)
        {
            if(currentStage.userID === user_name)
            {
                toReturn.push(activeP);
            }
        })
    });
};