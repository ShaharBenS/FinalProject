let mongoose = require("mongoose");

const Schema = mongoose.Schema;

const waitingProcessStructuresSchema = new Schema({
    userEmail: String,
    structureName: String,
    addOrEdit: Boolean, // true for add
    date: Date,
    sankey: String,
    onlineForms: [{type: Schema.Types.ObjectId, ref: 'OnlineForm'}]
});

module.exports = mongoose.model('waitingProcessStructuresSchema', waitingProcessStructuresSchema);