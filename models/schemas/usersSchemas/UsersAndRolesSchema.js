const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UsersAndRolesSchema = new Schema({
    roleName: {type:String, unique:true},
    userEmail: [{type:String}],
    color : String,
    children: [{type:Schema.Types.ObjectId, ref:'UsersAndRolesSchema'}]
});

module.exports = mongoose.model('UsersAndRoles', UsersAndRolesSchema);