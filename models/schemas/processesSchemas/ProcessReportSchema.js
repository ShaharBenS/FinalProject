const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const processReportSchema = new Schema({
    processName: {type: String, unique: true},
    status: String,
    processDate: Date,
    processUrgency: { type: Number, min: 1, max: 3},
    processCreatorEmail : String,
    creationTime: Date,
    currentStages: [Number],
    filledOnlineForms: [{type: Schema.Types.ObjectId, ref: 'FilledOnlineForm'}],
    stages: [{
        roleName: String,
        userEmail: String, //TODO Maybe Link To User In UsersAndRoles,
        userName: String,
        stageNum: Number,
        approvalTime: Date,
        comments: String,
        action: {type: String, enum: ['cancel', 'continue', 'return']},
        attachedFilesNames: [String]
    }]
});

module.exports = mongoose.model('ProcessReport', processReportSchema);