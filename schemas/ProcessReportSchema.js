const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const processReportSchema = new Schema({
    process_name: {type: String, unique: true},
    status: String,
    time_creation: Date,
    current_stages: [Number],
    initials: [Number],
    stages: [{
        type: String,
        roleName: {type: Schema.Types.ObjectId, ref: 'UsersAndRole'},
        userEmail: String, //TODO Maybe Link To User In UsersAndRoles,
        stageNum: Number,
        time_approval: Date,
        comment: String,
    }],
});

module.exports = mongoose.model('ProcessReportSchema', processReportSchema);