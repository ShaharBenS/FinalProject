const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    userEmail: String,
    notification:
        {
            notificationType: String,
            description: String,
            date: Date,
        }

});

module.exports = mongoose.model('Notification', NotificationSchema);