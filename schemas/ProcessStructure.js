const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var processStructure = new Schema({
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
        condition: {type: String, enum: ['And', 'Or']},
        nextStages: [Number],
        stagesToWaitFor: [Number],
    }],
});

this.processStructure = mongoose.model('ProcessStructure', processStructure);