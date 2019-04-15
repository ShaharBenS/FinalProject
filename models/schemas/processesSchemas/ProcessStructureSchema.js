let mongoose = require("mongoose");
let idValidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const processStructureSchema = new Schema({
    structureName: {type:String,unique:true},
    onlineForms: [{type: Schema.Types.ObjectId, ref:'OnlineForm'}],
    stages: [{
        kind: {type:String, enum: ["ByRole","ByDereg","Creator"]},
        /*
            If the kind is ByRole the RoleID field is being used
            If the kind is ByDereg the dereg field is being used, and the roleID should be undefined
            If the kind is Creator the stage is of the creator
         */
        roleID: {type: Schema.Types.ObjectId, ref: 'UsersAndRoles'},
        dereg : {type:String,enum:["1","2","3","4","5"]},
        stageNum: Number,
        nextStages: [Number],
        stagesToWaitFor: [Number]
    }],
    sankey: String,
    available: {type:Boolean, default: true}
});

processStructureSchema.plugin(idValidator);

module.exports = mongoose.model('processStructure', processStructureSchema);