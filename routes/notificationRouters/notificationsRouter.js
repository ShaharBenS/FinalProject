let express = require('express');
let router = express.Router();
let notificationsController = require('../../controllers/notificationsControllers/notificationController');

router.get('/myNotifications', function (req, res) {
    notificationsController.getUserNotifications(req.user.emails[0].value,(err,result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.render('notificationsViews/notifications',{notifications:result});
        }
    });
});

router.get('/getNotifications',function (req,res) {
    notificationsController.getUserNotifications(req.user.emails[0].value,(err,result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
});

module.exports = router;