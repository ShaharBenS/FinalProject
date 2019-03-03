let express = require('express');
let router = express.Router();
let passportGoogle = require('../../auth/google');

/* LOGIN ROUTER */
router.get('/login', function (req, res, next)
{
    res.render('login', {title: 'Please Sign In with:'});
});

/* LOGOUT ROUTER */
router.get('/logout', function (req, res)
{
    console.log('1111111111111111');
    console.log("logging out");
    console.log(req.user.emails[0].value);
    console.log(req.isAuthenticated());
    console.log('1111111111111111');
    req.logout();
    res.redirect('/');
    console.log('2222222222222222');
    console.log("logging out");
    //console.log(req.user.emails[0].value);
    console.log(req.isAuthenticated());
    console.log('2222222222222222');
});

/* GOOGLE ROUTER */
router.get('/google',
    passportGoogle.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.email']}));

router.get('/google/callback',
    passportGoogle.authenticate('google', {failureRedirect: '/NotAgudaEmployee'}),
    function (req, res)
    {
        res.redirect('/');
    });

module.exports = router;
