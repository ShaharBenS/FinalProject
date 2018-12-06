const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usersAndRole = new Schema({
    roleName: {type:String, unique:true},
    userEmail: [{type:Schema.Types.ObjectId, ref:'User'}],
    children: [{type:Schema.Types.ObjectId, ref:'UsersAndRoles'}]
});

this.usersAndRole = mongoose.model('UsersAndRoles', usersAndRole);