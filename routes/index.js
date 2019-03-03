let express = require('express');
let router = express.Router();

/* GET home page. */

router.get('/', ensureAuthenticated, function (req, res, next) {
     res.render('index');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.render('index');
    }
    else
    {
        res.redirect('/auth/google')
    }
}
module.exports = router;