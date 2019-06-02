const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filledOnlineFormSchema = new Schema({
    formName: String,
    fields: [{fieldName: String, value: String}],
    isLocked: {type: Boolean, default: false},
});

module.exports = mongoose.model('FilledOnlineForm', filledOnlineFormSchema);