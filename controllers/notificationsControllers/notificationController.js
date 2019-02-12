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