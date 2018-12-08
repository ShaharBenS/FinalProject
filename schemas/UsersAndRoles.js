const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UsersAndRoles = new Schema({
    roleName: {type:String, unique:true},
    userEmail: [{type:String}],
    children: [{type:Schema.Types.ObjectId, ref:'UsersAndRoles'}]
});

module.exports = mongoose.model('UsersAndRoles', UsersAndRoles);