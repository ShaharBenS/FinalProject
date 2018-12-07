var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('../public/draw_sankey/server/html/editor/index.html', {title: 'Express'});
});

router.post('/backend/file/save',function (req,res,next) {
   res.send("okay?");
});

module.exports = router;
