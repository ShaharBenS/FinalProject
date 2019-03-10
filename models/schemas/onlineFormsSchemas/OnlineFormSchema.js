const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const onlineFormSchema = new Schema({
    formName: {type: String, unique: true},
    HTMLSource : String,
});

module.exports = mongoose.model('OnlineForm', onlineFormSchema);