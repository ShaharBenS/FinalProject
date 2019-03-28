let express = require('express');
let router = express.Router();
let usersAndRolesController = require('../controllers/usersControllers/usersAndRolesController');

/* GET home page. */

router.get('/', function (req, res)
{
    res.render('userViews/login');
});

router.get('/getTopBar', function (req, res)
{
    usersAndRolesController.getRoleNameByUsername(req.user.emails[0].value, (err, roleName) =>
    {
        if (err) {
            res.render('topbar', {roleName: "RoleNotFound", userFullName: ''});
        }
        else {
            usersAndRolesController.getFullNameByEmail(req.user.emails[0].value,(err,fullName)=>{
                if(err){
                    res.render('topbar', {roleName: roleName, userFullName: 'FullNameNotFound'});
                }
                else{
                    res.render('topbar', {roleName: roleName, userFullName: fullName});
                }
            });
        }
    });
});

router.get('/Home', function (req, res)
{
    res.render('index');
});


module.exports = router;