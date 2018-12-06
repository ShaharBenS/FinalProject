const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var roles = new Schema({roleName : {type:String, unique:true}});

module.exports = mongoose.model('Roles', roles);