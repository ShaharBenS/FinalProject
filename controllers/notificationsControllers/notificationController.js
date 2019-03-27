let notificationAccessor = require('../../models/accessors/notificationsAccessor');
let activeProcessController = require('../processesControllers/activeProcessController');
let waitingActiveProcessReminderNotification = require('../../domainObjects/notifications/waitingActiveProcessReminderNotification');

module.exports.getUserNotifications = (userEmail, callback) =>
{
    notificationAccessor.findNotifications({userEmail: userEmail}, (err, result) =>
    {
        if (err) {
            callback(err);
        }
        else {
            let dates = result.map(notification => notification.notification.date);
            activeProcessController.convertDate(dates, true);
            let toReturn = result.map((notification, i) =>
            {
                return {
                    mongoId: notification._id,
                    notificationType: notification.notification.notificationType,
                    description: notification.notification.description,
                    date: dates[i],
                };
            });
            callback(null, toReturn);
        }
    })
};

module.exports.addNotificationToUser = (email, notification, callback) =>
{
    let notificationObject = notification.getNotification();
    notificationAccessor.addNotification({
        userEmail: email,
        notification: notification.getNotification(),
    }, callback);
};

module.exports.deleteNotification = (_id, callback) =>
{
    notificationAccessor.deleteAllNotifications({_id:_id},callback);
};


/*
    TODO: This function has a bug that need to be fixed. When the active process diverges into two roles, the last approach time , however, applies on both of them.
 */
module.exports.updateNotifications = () =>
{
    activeProcessController.getAllActiveProcesses((err, activeProcesses) =>
    {
        if (err) {
        }
        else {
            activeProcesses.forEach(activeProcess =>
            {
                let timePassedInHours = ((new Date()) - activeProcess.lastApproached) / 36e5;
                if (timePassedInHours % activeProcess.notificationTime === 0) {
                    let emails = [];
                    activeProcess.currentStages.forEach(curr =>
                    {
                        emails.push(activeProcess.stages[curr].userEmail);
                    });
                    emails.reduce((prev, curr) =>
                    {
                        return (err) =>
                        {
                            if (err) {
                                prev(err);
                            }
                            else {
                                this.addNotificationToUser(curr,
                                    new waitingActiveProcessReminderNotification(
                                        "התהליך " + activeProcess.processName + " עדיין מחכה לטיפולך. זמן שעבר: " + timePassedInHours + " שעות"),
                                    (err) =>
                                    {
                                        if (err) {
                                            prev(err);
                                        }
                                        else {
                                            prev(null);
                                        }
                                    }
                                );
                            }
                        }
                    }, (err) =>
                    {
                        if (err) {
                            console.log(err);
                        }
                    })(null);
                }
            });
        }
    })
};