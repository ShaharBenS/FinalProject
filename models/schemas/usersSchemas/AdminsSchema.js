const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AdminsSchema = new Schema({
    userEmail: {type:String, unique:true},
});

module.exports = mongoose.model('Admins', AdminsSchema);