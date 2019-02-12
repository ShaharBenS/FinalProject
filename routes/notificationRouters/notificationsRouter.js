let express = require('express');
let router = express.Router();

router.get('/myNotifications', function (req, res) {
    res.render('notificationsViews/notifications');
});

module.exports = router;