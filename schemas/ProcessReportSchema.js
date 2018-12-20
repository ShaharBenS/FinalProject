const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const processReportSchema = new Schema({
    process_name: {type: String, unique: true},
    status: String,
    time_creation: Date,
    current_stages: [Number],
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRole'},
        userEmail: String, //TODO Maybe Link To User In UsersAndRoles,
        stageNum: Number,
        time_approval: Date,
        comments: String,
    }],
});

module.exports = mongoose.model('ProcessReportSchema', processReportSchema);