const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usersAndRole = new Schema({
    roleName: {type:String, unique:true},
    userID: [{type:Schema.Types.ObjectId, ref:'User'}],
    children: [{type:Schema.Types.ObjectId, ref:'UsersAndRoles'}]
});

this.usersAndRole = mongoose.model('UsersAndRoles', usersAndRole);