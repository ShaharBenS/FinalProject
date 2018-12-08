let express = require('express');
let router = express.Router();

router.get('/NotificationPage', function (req, res) {
    res.render('NotificationPage', {title: 'Express'});
});

module.exports = router;