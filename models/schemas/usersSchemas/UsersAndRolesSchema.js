const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UsersAndRolesSchema = new Schema({
    roleName: {type:String, unique:true},
    userEmail: [{type:String}],
    /*
        1 - רכז
        2 - מנהל
        3 - רמ"ד
        4 - סיו"ר
        5 - יו"ר
     */
    dereg : {type:String,enum:["1","2","3","4","5"]},
    children: [{type:Schema.Types.ObjectId, ref:'UsersAndRolesSchema'}]
});

module.exports = mongoose.model('UsersAndRoles', UsersAndRolesSchema);