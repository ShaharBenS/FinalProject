const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeProcess = new Schema({
    time_creation: Date,
    current_stages: [Number],
    process_name: String,
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
        userID: {type: Schema.Types.ObjectId, ref: 'User'},
        condition: {type: String, enum: ['And', 'Or']},
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