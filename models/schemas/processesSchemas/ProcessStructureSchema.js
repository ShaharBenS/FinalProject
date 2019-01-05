let mongoose = require("mongoose");
const Schema = mongoose.Schema;

const processStructureSchema = new Schema({
    structureName: {type:String,unique:true},
    initials: [Number],
    stages: [{
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
        stageNum: Number,
        nextStages: [Number],
        stagesToWaitFor: [Number],
        onlineForms: [{type: Schema.Types.ObjectId, ref:'OnlineForm'}],
        attachedFilesNames: [String],
    }],
    sankey: String
});

module.exports = mongoose.model('processStructure', processStructureSchema);