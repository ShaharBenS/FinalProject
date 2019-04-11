let mongoose = require("mongoose");
let idValidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const processStructureSchema = new Schema({
    structureName: {type:String,unique:true},
    onlineForms: [{type: Schema.Types.ObjectId, ref:'OnlineForm'}],
    stages: [{
        kind: {type:String, enum: ["ByRole","ByColor","Creator","AboveCreator"]},

        /*
            If the kind is "ByRole" the RoleID field is being used
            If the kind is ByColor the color field is being used, and the roleID should be undefined
            If the kind is Creator the stage is of the creator
            If the kind is AboveCreator the aboveCreatorNumber field represents the number of roles above the creator
         */
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
        color: String,
        aboveCreatorNumber: Number,

        stageNum: Number,
        nextStages: [Number],
        stagesToWaitFor: [Number],
        attachedFilesNames: [String],
    }],
    sankey: String,
    available: {type:Boolean, default: true}
});

processStructureSchema.plugin(idValidator);

module.exports = mongoose.model('processStructure', processStructureSchema);