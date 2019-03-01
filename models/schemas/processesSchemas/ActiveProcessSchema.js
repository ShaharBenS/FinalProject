const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeProcessSchema = new Schema({
    processName: {type: String, unique: true},
    creationTime: Date,
    notificationTime: Number,
    currentStages: [Number],
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRole'},
        userEmail: String, //TODO Maybe Link To User In UsersAndRoles,
        stageNum: Number,
        nextStages: [Number],
        stagesToWaitFor: [Number],
        originStagesToWaitFor: [Number],
        timeApproval: Date,
        onlineForms: [{type: Schema.Types.ObjectId, ref: 'OnlineForm'}],
        filledOnlineForms: [{type: Schema.Types.ObjectId, ref: 'FilledOnlineForm'}],
        attachedFilesNames: [String],
        comments: String
    }],
});

module.exports = mongoose.model('ActiveProcess', activeProcessSchema);