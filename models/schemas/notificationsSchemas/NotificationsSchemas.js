const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NotificationsSchema = new Schema({
    userEmail: {type:String, unique:true},
    notifications: [
        {
            type: String,
            description: String,
            date: Date,
        }
    ]
});

module.exports = mongoose.model('Notifications', NotificationsSchema);