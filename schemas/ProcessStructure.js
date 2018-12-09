let mongoose = require("mongoose");
const Schema = mongoose.Schema;

const processStructure = new Schema({
    structure_name: {type:String,unique:true},
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRole'},
        stageNum: Number,
        nextStages: [Number],
        stagesToWaitFor: [Number],
        online_forms: [{type: Schema.Types.ObjectId, ref:'OnlineForm'}],
        attached_files_names: [String],
    }],
    sankey: String
});

module.exports = mongoose.model('processStructure', processStructure);