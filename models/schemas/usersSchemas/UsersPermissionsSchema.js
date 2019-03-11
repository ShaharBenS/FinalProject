const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UsersPermissionsSchema = new Schema({
    userEmail: {type:String, unique:true},
    permissions: [{type:Boolean}] //
});

module.exports = mongoose.model('UsersPermissions', UsersPermissionsSchema);