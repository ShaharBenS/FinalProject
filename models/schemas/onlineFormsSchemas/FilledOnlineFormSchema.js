const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filledOnlineFormSchema = new Schema({
    formName: String,
    fields: [{fieldName: String, value: String}],
});

module.exports = mongoose.model('FilledOnlineForm', filledOnlineFormSchema);