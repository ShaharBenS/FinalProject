const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var user = new Schema({userEmail: {type:String, unique:true},userRole: String});

module.exports = mongoose.model('User', user);