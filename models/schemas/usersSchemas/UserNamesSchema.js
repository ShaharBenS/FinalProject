const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UsersNamesSchema = new Schema({
    userEmail: {type:String, unique:true},
    userName: {type:String},
});

module.exports = mongoose.model('UsersNames', UsersNamesSchema);