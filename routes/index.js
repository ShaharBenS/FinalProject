let express = require('express');
let router = express.Router();
let usersAndRolesController = require('../controllers/usersControllers/usersAndRolesController');
let usersPermissionsController = require('../controllers/usersControllers/UsersPermissionsController');
let notificationController = require('../controllers/notificationsControllers/notificationController');

/* GET home page. */

router.get('/', function (req, res)
{
    if(req.isAuthenticated()){
        res.redirect('/Home');
    }
    else{
        res.render('userViews/login');
    }
});

router.get('/getTopBar', function (req, res)
{
    if (req.isAuthenticated()) {
        usersPermissionsController.getUserPermissions(req.user.emails[0].value, (err, permission) =>
        {
            if (err) {
                res.send(err);
            }
            else {
                let permissions = "style='display: none'";
                if (permission.permissionsManagementPermission) {
                    permissions = "style='display: flex'";
                }
                usersAndRolesController.getRoleNameByUsername(req.user.emails[0].value, (err, roleName) =>
                {
                    if (err) {
                        usersAndRolesController.findAdmins((err,admins) =>
                        {
                           if(err){
                               res.render('topbar', {
                                   roleName: "RoleNotFound",
                                   userFullName: '',
                                   permissionsStyle: permissions,
                                   notificationCount: ''
                               });
                           }
                           else if(admins.includes(req.user.emails[0].value)){
                               res.render('topbar', {
                                   roleName: "Admin",
                                   userFullName: 'אדמין',
                                   permissionsStyle: permissions,
                                   notificationCount: ''
                               });
                           }
                           else{
                               res.render('topbar', {
                                   roleName: "RoleNotFound",
                                   userFullName: '',
                                   permissionsStyle: permissions,
                                   notificationCount: ''
                               });
                           }
                        });
                    }
                    else {
                        usersAndRolesController.getFullNameByEmail(req.user.emails[0].value, (err, fullName) =>
                        {
                            if (err) {
                                res.render('topbar', {
                                    roleName: roleName,
                                    userFullName: 'FullNameNotFound',
                                    permissionsStyle: permissions,
                                    notificationCount: ''
                                });
                            }
                            else {
                                notificationController.countNotifications(req.user.emails[0].value, (err, count) =>
                                {
                                    if (err) {
                                        res.send(err);
                                    }
                                    else {
                                        res.render('topbar', {
                                            roleName: roleName,
                                            userFullName: fullName,
                                            permissionsStyle: permissions,
                                            notificationCount: count === 0 ? "" : count
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        res.redirect('/')
    }
});

router.get('/Home', function (req, res)
{
    if (req.isAuthenticated()) {
        res.render('index')
    }
    else {
        res.redirect('/')
    }
});


module.exports = router;