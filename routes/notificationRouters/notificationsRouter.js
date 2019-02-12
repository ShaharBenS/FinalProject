let express = require('express');
let router = express.Router();
let notificationsController = require('../../controllers/notificationsControllers/notificationController');

router.get('/myNotifications', function (req, res) {
    res.render('notificationsViews/notifications');
});

router.get('/getNotifications',function (req,res) {
    if(req.query.userEmail){
        notificationsController.getUserNotifications(req.query.userEmail,(err,result)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send(result);
            }
        })
    }
});

module.exports = router;