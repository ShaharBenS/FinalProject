let express = require('express');
let router = express.Router();
let notificationsController = require('../../controllers/notificationsControllers/notificationController');

router.get('/myNotifications', function (req, res)
{
    notificationsController.getUserNotifications(req.user.emails[0].value, (err, result) =>
    {
        if (err) {
            res.send(err);
        }
        else {
            res.render('notificationsViews/notifications', {notifications: result});
        }
    });
});

router.get('/getNotifications', function (req, res)
{
    notificationsController.getUserNotifications(req.user.emails[0].value, (err, result) =>
    {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    })
});

router.post('/deleteNotification', function (req, res)
{
    if (req.body.mongoId) {
        notificationsController.deleteNotification(req.body.mongoId, (err) =>
        {
            if (err) {
                res.send(err);
            }
            else {
                res.send('success');
            }
        })
    }
    else {
        res.send('Error: no id specified')
    }
});

router.post('/deleteAllNotification', function (req, res)
{
    notificationsController.deleteAllNotification(req.user.emails[0].value,(err) =>
    {
        if (err) {
            res.send(err);
        }
        else {
            res.send('success');
        }
    })
});

module.exports = router;