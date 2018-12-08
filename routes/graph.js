let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    res.render('../public/draw_sankey/server/html/editor/index.html', {title: 'Express'});
});

module.exports = router;