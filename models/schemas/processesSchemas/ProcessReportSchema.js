const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const processReportSchema = new Schema({
    processName: {type: String},
    status: String,
    processDate: Date,
    processUrgency: { type: Number, min: 1, max: 3},
    processCreatorEmail : String,
    processCreatorName : String,
    creationTime: Date,
    filledOnlineForms: [{type: Schema.Types.ObjectId, ref: 'FilledOnlineForm'}],
    attachedFilesNames: [String],
    stages: [{
        roleName: String,
        userEmail: String, //TODO Maybe Link To User In UsersAndRoles,
        userName: String,
        stageNum: Number,
        approvalTime: Date,
        comments: String,
        action: {type: String, enum: ['cancel', 'continue', 'return']},
    }]
});

module.exports = mongoose.model('ProcessReport', processReportSchema);