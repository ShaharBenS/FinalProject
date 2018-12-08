let express = require('express');
let router = express.Router();

router.get('/ProcessStartPage', function (req, res) {
    res.render('ProcessStartPage', {title: 'Express'});
});
router.get('/MyActiveProcessesPage', function (req, res) {
    res.render('MyActiveProcessesPage', {title: 'Express'});
});
router.get('/MyWaitingProcessesPage', function (req, res) {
    res.render('MyWaitingProcessesPage', {title: 'Express'});
});
module.exports = router;