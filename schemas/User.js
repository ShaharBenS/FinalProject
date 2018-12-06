const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var user = new Schema({
    userEmail: String,
    userRole: String,
});

module.exports = mongoose.model('User', user);