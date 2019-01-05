const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UsersAndRolesTreeSankeySchema = new Schema({
    sankey: String,
});

let model = mongoose.model('UsersAndRolesTreeSankey', UsersAndRolesTreeSankeySchema);
module.exports = model;