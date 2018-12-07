let ActiveProcess = require("../../schemas/ActiveProcess");
let ProcessStructure = require("../../schemas/ProcessStructure");

module.exports.activateProcess = (structure_name,process_name,initial_stage, callback)=>{
    ProcessStructure.find({structure_name:structure_name});

    ActiveProcess.create({
        time_creation: new Date(),
        current_stages: [initial_stage],
        process_name: process_name,
        initials: [Number],
        stages: [{
            roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRole'},
            userID: {type: Schema.Types.ObjectId, ref: 'Role'},
            condition: {type: String, enum: ['And', 'Or']},
            nextStages: [Number],
            stagesToWaitFor: [Number],
            origin_stagesToWaitFor: [Number],
            time_approval: Date,
            online_forms: [{type: Schema.Types.ObjectId, ref:'OnlineForm'}],
            filled_online_forms: [{type: Schema.Types.ObjectId, ref:'FilledOnlineForm'}],
            attached_files_names: [String],
        }],
    },callback)
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