let express = require('express');
let router = express.Router();

router.get('/CreateNewProcessStructure', function (req, res) {
    res.render('CreateNewProcessStructure', {title: 'Express'});
});
router.get('/EditProcessStructure', function (req, res) {
    res.render('EditProcessStructure', {title: 'Express'});
});
module.exports = router;