let express = require('express');
let router = express.Router();

router.get('/notificationPage', function (req, res) {
    res.render('NotificationPage');
});

module.exports = router;