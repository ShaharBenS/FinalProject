let notificationAccessor = require('../../models/accessors/notificationsAccessor');
let activeProcessController = require('../processesControllers/activeProcessController');


module.exports.getUserNotifications = (userEmail,callback)=>{
    notificationAccessor.findNotifications({userEmail:userEmail},(err,result)=>{
        if(err){
            callback(err);
        }
        else{
            let dates = result.map(notification=>notification.notification.date);
            activeProcessController.convertDate(dates,true);
            let toReturn = result.map((notification,i)=>{
               return {
                   notificationType: notification.notification.notificationType,
                   description: notification.notification.description,
                   date: dates[i],
               };
            });
            callback(null,toReturn);
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

module.exports.updateNotifications = ()=>{
    activeProcessController.getAllActiveProcesses((err,activeProcesses)=>{
        if(err){}
        else{
            activeProcesses.forEach(activeProcess=>{
                if(((new Date()) - activeProcess.lastApproached) / 36e5 % activeProcess.notificationTime === 0){
                    this.addNotificationToUser();
                }
            });
        }
    })
};