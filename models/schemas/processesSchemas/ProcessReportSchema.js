const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const processReportSchema = new Schema({
    processName: {type: String, unique: true},
    status: String,
    processDate: Date,
    processUrgency: { type: Number, min: 1, max: 10},
    creationTime: Date,
    currentStages: [Number],
    initials: [Number],
    stages: [{
        role: {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
        user: {type: Schema.Types.ObjectId, ref: 'UsersNames'},
        stageNum: Number,
        approvalTime: Date,
        comments: String,
        action: {type: String, enum: ['cancel', 'continue', 'return']},
        filledOnlineForms: [{type: Schema.Types.ObjectId, ref: 'FilledOnlineForm'}],
        attachedFilesNames: [String],
    }],
});

module.exports = mongoose.model('ProcessReport', processReportSchema);