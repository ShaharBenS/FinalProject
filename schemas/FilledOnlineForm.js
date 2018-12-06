const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filledOnlineForm = new Schema({
    name: String,
    fields: [{field_name: String, value: String}],
});

this.filledOnlineForm = mongoose.model('FilledOnlineForm', filledOnlineForm);