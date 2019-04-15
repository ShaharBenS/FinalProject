const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeProcessSchema = new Schema({
    processName: {type: String, unique: true},
    startingMador: String,
    creatorUserEmail : String,
    processDate: Date,
    processUrgency: { type: Number, min: 1, max: 10},
    creationTime: Date,
    notificationTime: Number,
    currentStages: [Number],
    onlineForms: [{type: Schema.Types.ObjectId, ref: 'OnlineForm'}],
    filledOnlineForms: [{type: Schema.Types.ObjectId, ref: 'FilledOnlineForm'}],
    stages: [{
        kind: {type:String, enum: ["ByRole","ByDereg","Creator"]},
        dereg : {type:String,enum:["1","2","3","4","5"]},
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRole'},
        userEmail: String,
        stageNum: Number,
        nextStages: [Number],
        stagesToWaitFor: [Number],
        originStagesToWaitFor: [Number],
        approvalTime: Date,
        attachedFilesNames: [String],
        comments: String
    }],
    lastApproached: Date
});

module.exports = mongoose.model('ActiveProcess', activeProcessSchema);