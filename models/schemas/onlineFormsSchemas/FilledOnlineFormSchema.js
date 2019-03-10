const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filledOnlineFormSchema = new Schema({
    formID: {type: Schema.Types.ObjectId, ref: 'OnlineForm'},
    fields: [{fieldName: String, value: String}],
});

module.exports = mongoose.model('FilledOnlineForm', filledOnlineFormSchema);