let express = require('express');
let router = express.Router();
let passportGoogle = require('../../auth/google');
let passportOutlook = require('../../auth/outlook');

/* LOGOUT ROUTER */
router.get('/logout', function (req, res)
{
    req.logout();
    res.redirect('/');
});

/* GOOGLE ROUTER */
router.get('/google',
    passportGoogle.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.email']}));

router.get('/google/callback',
    passportGoogle.authenticate('google', {failureRedirect: '/NotAgudaEmployee'}),
    function (req, res)
    {
        if (req.isAuthenticated()) {
            res.redirect('/Home')
        }
        else
        {
            res.redirect('userViews/login')
        }
    });

///////////////
router.get('/outlook',
    passportOutlook.authenticate('windowslive', {
        scope: [
            'openid',
            'profile',
            'offline_access',
            'https://outlook.office.com/Mail.Read'
        ]
    })
);

router.get('/outlook/callback',
    passportOutlook.authenticate('windowslive', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/Home');
    });
///////////////
module.exports = router;
