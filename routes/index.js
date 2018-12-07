var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('../public/mxgraph/javascript/examples/grapheditor/www/index.html', {title: 'Express'});
});


module.exports = router;
