let mongoose = require("mongoose");

const Schema = mongoose.Schema;

const waitingProcessStructures = new Schema({
    userEmail: String,
    structureName: String,
    addOrEdit: Boolean, // true for add
    date: Date,
    sankey: String,
    onlineFormsOfStage: String,
});

module.exports = mongoose.model('waitingProcessStructures', waitingProcessStructures);