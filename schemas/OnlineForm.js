const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const onlineForm = new Schema({
    name: String,
    fields: [{field_name: String, value: String}],
});

this.onlineForm = mongoose.model('OnlineForm', onlineForm);