var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('login', {title: 'Express'});
});

router.post('/backend/file/save',function (req,res,next) {
   res.send("okay?");
});



router.post('/backend/sankey/weights',function (req,res,next) {
    res.send([{
        file: req.body.id
    }]);
});

module.exports = router;
