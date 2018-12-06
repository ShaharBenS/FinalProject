const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const onlineForm = new Schema({
    name: String,
    HTMLSource : String,
});

this.onlineForm = mongoose.model('OnlineForm', onlineForm);