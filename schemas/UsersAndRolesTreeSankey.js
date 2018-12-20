const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UsersAndRolesTreeSankey = new Schema({
    sankey: String,
});

let model = mongoose.model('UsersAndRolesTreeSankey', UsersAndRolesTreeSankey);
module.exports = model;