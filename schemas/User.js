const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var user = new Schema({userEmail: {type:String, unique:true},userRole: {type:Schema.Types.ObjectId, ref:'Roles'}});

module.exports = mongoose.model('User', user);