const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeProcess = new Schema({
    process_name: {type: String, unique: true},
    time_creation: Date,
    current_stages: [Number],
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRole'},
        userID: {type: Schema.Types.ObjectId, ref: 'Role'},
        stageNum: Number,
        nextStages: [Number],
        stagesToWaitFor: [Number],
        origin_stagesToWaitFor: [Number],
        time_approval: Date,
        online_forms: [{type: Schema.Types.ObjectId, ref:'OnlineForm'}],
        filled_online_forms: [{type: Schema.Types.ObjectId, ref:'FilledOnlineForm'}],
        attached_files_names: [String],
    }],
});

module.exports = mongoose.model('ActiveProcess', activeProcess);