const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const onlineFormSchema = new Schema({
    formName: String,
    HTMLSource : String,
});

module.exports = mongoose.model('OnlineForm', onlineFormSchema);