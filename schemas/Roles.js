const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var roles = new Schema({roleName : String});

module.exports = mongoose.model('Roles', roles);