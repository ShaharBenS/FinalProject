let express = require('express');
let router = express.Router();

router.get('/notAgudaEmployee', function (req, res) {
    res.render('errorsViews/NotAgudaEmployee');
});

module.exports = router;