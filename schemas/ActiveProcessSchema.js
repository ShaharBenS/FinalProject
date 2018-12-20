const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeProcessSchema = new Schema({
    process_name: {type: String, unique: true},
    time_creation: Date,
    notificationTime: Number,
    current_stages: [Number],
    initials: [Number],
    stages: [{
        roleName: {type: Schema.Types.ObjectId, ref: 'UsersAndRole'},
        userEmail: String, //TODO Maybe Link To User In UsersAndRoles,
        stageNum: Number,
        nextStages: [Number],
        stagesToWaitFor: [Number],
        origin_stagesToWaitFor: [Number],
        time_approval: Date,
        online_forms: [{type: Schema.Types.ObjectId, ref: 'OnlineForm'}],
        filled_online_forms: [{type: Schema.Types.ObjectId, ref: 'FilledOnlineForm'}],
        attached_files_names: [String],
        comments: String
    }],
});

module.exports = mongoose.model('ActiveProcessSchema', activeProcessSchema);