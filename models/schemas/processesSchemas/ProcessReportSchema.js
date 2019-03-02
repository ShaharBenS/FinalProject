const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const processReportSchema = new Schema({
    processName: {type: String, unique: true},
    status: String,
    creationTime: Date,
    currentStages: [Number],
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRole'},
        userEmail: String, //TODO Maybe Link To User In UsersAndRoles,
        stageNum: Number,
        approvalTime: Date,
        comments: String,
    }],
});

module.exports = mongoose.model('ProcessReport', processReportSchema);