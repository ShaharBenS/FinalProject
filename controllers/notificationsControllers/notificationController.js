let notificationAccessor = require('../../models/accessors/notificationsAccessor');

module.exports.getUserNotifications = (userEmail,callback)=>{
    notificationAccessor.findNotifications({userEmail:userEmail},(err,result)=>{
        if(err){
            callback(err);
        }
        else{
            callback(null,result);
        }
    })
};

module.exports.addNotificationToUser = (email, notification, callback)=>{
    let notificationObject = notification.getNotification();
    notificationAccessor.addNotification({
        userEmail:email,
        notification:notification.getNotification(),
    }, callback);
};