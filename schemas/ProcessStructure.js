const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const processStructure = new Schema({
    structure_name: String,
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRole'},
        condition: {type: String, enum: ['And', 'Or']},
        nextStages: [Number],
        stagesToWaitFor: [Number],
        online_forms: [{type: Schema.Types.ObjectId, ref:'OnlineForm'}],
        attached_files_names: [String],
    }],
});

this.processStructure = mongoose.model('ProcessStructure', processStructure);