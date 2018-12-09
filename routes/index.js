var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('../public/draw_sankey/server/html/editor/index.html', {structure_name: ''});
});

module.exports = router;