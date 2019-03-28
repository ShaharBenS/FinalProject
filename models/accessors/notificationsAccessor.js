let notifications = require("../schemas/notificationsSchemas/NotificationSchema");

module.exports.addNotification = (newNotification,callback)=>{
    return notifications.create(newNotification,callback);
};

module.exports.findNotifications = (criteria, callback)=>{
    return notifications.find(criteria,callback);
};

module.exports.deleteAllNotifications = (criteria,callback)=>{
    return notifications.deleteMany(criteria,callback);
};

module.exports.updateNotification = (criteria,update,callback)=>{
    return notifications.updateMany(criteria,update,callback);
};

module.exports.countNotifications = (criteria,callback)=>{
    return notifications.countDocuments(criteria,callback);
};