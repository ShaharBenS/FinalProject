let mongoose = require("mongoose");
let idValidator = require('mongoose-id-validator');

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
    sankey: String,
    available: {type:Boolean, default: true}
});

processStructureSchema.plugin(idValidator);

module.exports = mongoose.model('processStructure', processStructureSchema);