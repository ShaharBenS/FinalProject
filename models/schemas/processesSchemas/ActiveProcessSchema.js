const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let activeProcessSchema = new Schema({
    processName: {type: String, unique: true},
    creatorRole : {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
    processDate: Date,
    processUrgency: { type: Number, min: 1, max: 10},
    creationTime: Date,
    notificationTime: Number,
    currentStages: [Number],
    initials: [Number],
    stages: [{
        role: {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
        user: {type: Schema.Types.ObjectId, ref: 'UsersNames'},
        stageNum: Number,
        nextStages: [Number],
        stagesToWaitFor: [Number],
        originStagesToWaitFor: [Number],
        approvalTime: Date,
        onlineForms: [{type: Schema.Types.ObjectId, ref: 'OnlineForm'}],
        filledOnlineForms: [{type: Schema.Types.ObjectId, ref: 'FilledOnlineForm'}],
        attachedFilesNames: [String],
        comments: String
    }],
    lastApproached: Date,
}, { toJSON: { virtuals: true } });

module.exports = mongoose.model('ActiveProcess', activeProcessSchema);