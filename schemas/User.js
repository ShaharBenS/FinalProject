const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var user = new Schema({
    username: String,
    password: String,
});

module.exports = mongoose.model('User', user);