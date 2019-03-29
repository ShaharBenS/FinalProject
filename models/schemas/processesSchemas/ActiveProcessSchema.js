const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeProcessSchema = new Schema({
    processName: {type: String, unique: true},
    creatorRoleID : {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
    processDate: Date,
    processUrgency: { type: Number, min: 1, max: 10},
    creationTime: Date,
    notificationTime: Number,
    currentStages: [Number],
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
        userEmail: String,
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
});

activeProcessSchema.virtual('User', {
    ref: 'UsersNames',
    localField: 'stages.userEmail',
    foreignField: 'userEmail'
});

activeProcessSchema.set('toObject', { virtuals: true });
activeProcessSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ActiveProcess', activeProcessSchema);