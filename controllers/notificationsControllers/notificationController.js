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
    notificationAccessor.deleteAllNotifications({_id: _id}, callback);
};

module.exports.deleteAllNotification = (userEmail, callback) =>
{
    notificationAccessor.deleteAllNotifications({userEmail: userEmail}, callback);
};

module.exports.countNotifications = (email, callback) =>
{
    notificationAccessor.countNotifications({userEmail: email}, callback)
};

module.exports.updateNotifications = (callback) =>
{
    activeProcessController.getAllActiveProcesses((err, activeProcesses) =>
    {
        if (err) {
            console.log(err);
            callback(err);
        }
        else {
            activeProcesses.forEach(activeProcess =>
            {
                let emails = [];
                let times = [];
                let incrementCycles = [];
                activeProcess.currentStages.forEach(curr =>
                {
                    let timePassedInSeconds = Math.floor(((new Date()) - activeProcess.stages[curr].assignmentTime) % 60000 / 1000);
                    if (activeProcess.stages[curr].notificationsCycle <= timePassedInSeconds / activeProcess.notificationTime) {
                        incrementCycles.push(curr);
                        emails.push(activeProcess.stages[curr].userEmail);
                        times.push(timePassedInSeconds/60/60)
                    }
                });
                activeProcessController.incrementStageCycle(activeProcess.processName, incrementCycles, (_) =>
                {
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
                                        "התהליך " + activeProcess.processName + " עדיין מחכה לטיפולך. זמן שעבר: " + times[emails.indexOf(curr)] + " שעות", "תזכורת להתליך בהמתנה"),
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
                            callback(err);
                        }
                        else{
                            callback(null);
                        }
                    })(null);
                });
            });
        }
    })
};

module.exports.notifyFinishedProcess = (process, callback) =>
{
    // notifying participants
    let emails = [];
    process.stages.reduce((prev, curr) =>
    {
        return (err) =>
        {
            if (err) {
                prev(err);
            }
            else {
                if(!emails.includes(curr.userEmail)){
                    emails.push(curr.userEmail);
                    addNotificationToUser(curr.userEmail,
                        new Notification("התהליך " + process.processName + " הושלם בהצלחה", "תהליך נגמר בהצלחה"), prev);
                }
                else{
                    prev(null);
                }
            }
        }
    }, (err) =>
    {
        if (err) {
            console.log(err);
            callback(err);
        }
        else {
            callback(null);
        }
    })(null);
};

module.exports.notifyNotFinishedProcess = (process, newStages, callback) =>
{
    newStages.reduce((acc, curr) =>
    {
        return (err) =>
        {
            if (err) {
                acc(err);
            }
            else {
                let stage = process.getStageByStageNum(curr);

                usersAndRolesController.getEmailsByRoleId(stage.roleID, (err, emails) =>
                {
                    let available = true;
                    if (stage.userEmail !== null) {
                        available = false;
                        emails = [];
                        emails.push(stage.userEmail);
                    }
                    emails.reduce((acc, curr) =>
                    {
                        return (err) =>
                        {
                            if (err) {
                                acc(err);
                            }
                            else {
                                let notification = new Notification("התהליך " + process.processName + " מחכה ברשימת התהליכים הזמינים לך", "תהליך זמין");
                                if(!available){
                                    notification = new Notification("התהליך "+process.processName+" מחכה לטיפולך.","תהליך בהמתנה");
                                }
                                addNotificationToUser(curr,notification , acc);
                            }
                        }
                    }, (err) =>
                    {
                        if (err) {
                            acc(err);
                        }
                        else {
                            acc(null);
                        }
                    })(null);
                });
            }
        }
    }, (err) =>
    {
        if (err) {
            callback(err);
        }
        else {
            callback(null);
        }
    })(null);
};

module.exports.notifyCancelledProcess = (process, callback) =>
{
    let usersToNotify = process.getParticipatingUsers();
    usersToNotify.reduce((prev, curr) =>
    {
        return (err) =>
        {
            if (err) {
                prev(err);
            }
            else {
                addNotificationToUser(curr,
                    new Notification("התהליך " + process.processName + " בוטל על ידי " + curr, "תהליך בוטל"), prev);
            }
        }
    }, (err) =>
    {
        if (err) {
            console.log(err);
            callback(err);
        }
        else {
            callback(null);
        }
    })(null);
};

module.exports.addNotificationToUser = addNotificationToUser;