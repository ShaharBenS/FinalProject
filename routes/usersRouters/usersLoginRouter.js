let express = require('express');
let router = express.Router();

/* GET usersControllers listing. */
router.get('/', ensureAuthenticated, function (req, res, next) {
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login')
}

module.exports = router;