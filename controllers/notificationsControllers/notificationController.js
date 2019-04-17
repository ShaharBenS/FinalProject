let notificationAccessor = require('../../models/accessors/notificationsAccessor');
let activeProcessController = require('../processesControllers/activeProcessController');
let Notification = require('../../domainObjects/notification');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');

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

function addNotificationToUser(email, notification, callback)
{
    let notificationObject = notification.getNotification();
    notificationAccessor.addNotification({
        userEmail: email,
        notification: notification.getNotification(),
    }, callback);
}

module.exports.deleteNotification = (_id, callback) =>
{
    notificationAccessor.deleteAllNotifications({_id:_id},callback);
};

module.exports.deleteAllNotification = (callback) =>
{
    notificationAccessor.deleteAllNotifications({},callback);
};

module.exports.countNotifications = (email, callback) =>
{
    notificationAccessor.countNotifications({userEmail:email},callback)
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
                                    new Notification(
                                        "התהליך " + activeProcess.processName + " עדיין מחכה לטיפולך. זמן שעבר: " + timePassedInHours + " שעות","תזכורת להתליך בהמתנה"),
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

module.exports.notifyFinishedProcess = (process, callback) =>
{
    // notifying participants
    process.stages.reduce((prev, curr) => {
        return (err) => {
            if (err) {
                prev(err);
            } else {
                addNotificationToUser(curr.userEmail,
                    new Notification("התהליך" + process.processName + " הושלם בהצלחה", "תהליך נגמר בהצלחה"), prev)
            }
        }
    }, (err) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null);
        }
    })(null);
};

module.exports.notifyNotFinishedProcess = (process, callback) =>
{
    //TODO Kuti Notify Only the stages that are promoted not all current
    process.currentStages.reduce((acc, curr) => {
        return (err) => {
            if (err) {
                acc(err);
            } else {
                let stage = process.getStageByStageNum(curr);
                if(stage.userEmail === null)
                {
                    usersAndRolesController.getEmailsByRoleId(stage.roleID, (err, emails) => {
                        emails.reduce((acc, curr) => {
                            return (err) => {
                                if (err) {
                                    acc(err);
                                } else {
                                    addNotificationToUser(curr, new Notification("התהליך " + process.processName + " מחכה ברשימת התהליכים הזמינים לך", "תהליך זמין"), acc);
                                }
                            }
                        }, (err) => {
                            if (err) {
                                acc(err);
                            } else {
                                acc(null);
                            }
                        })(null);
                    });
                }
            }
        }
    }, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    })(null);
};

module.exports.addNotificationToUser = addNotificationToUser;