let express = require('express');
let UsersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let router = express.Router();

/*
  _____   ____   _____ _______
 |  __ \ / __ \ / ____|__   __|
 | |__) | |  | | (___    | |
 |  ___/| |  | |\___ \   | |
 | |    | |__| |____) |  | |
 |_|     \____/|_____/   |_|

 */


/*
   _____ ______ _______
  / ____|  ____|__   __|
 | |  __| |__     | |
 | | |_ |  __|    | |
 | |__| | |____   | |
  \_____|______|  |_|

 */

router.get('/getAllRoles', (req, res) =>
{
    UsersAndRolesController.getAllRoles((err, result) =>
    {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }
    })
});

router.get('/getRoleToEmails', (req, res) =>
{
    UsersAndRolesController.getRoleToEmails((err, roleToEmails) =>
    {
        if (err) {
            res.send(err);
        }
        else {
            res.send(roleToEmails);
        }
    });
});


router.get('/getRoleToDereg', (req, res) =>
{
    UsersAndRolesController.getRoleToDereg((err, roleToDereg) =>
    {
        if (err) {
            res.send(err);
        }
        else {
            res.send(roleToDereg);
        }
    });
});

router.get('/getRoleToMador', (req, res) =>
{
    UsersAndRolesController.getRoleToMador((err, roleToMador) =>
    {
        if (err) {
            res.send(err);
        }
        else {
            res.send(roleToMador);
        }
    });
});

router.get('/getEmailToFullName', (req, res) =>
{
    UsersAndRolesController.getEmailToFullName((err,emailToFullName)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(emailToFullName);
        }
    });
});

router.get('/getIdToRole', (req, res) =>
{
    UsersAndRolesController.getIdToRole((err, idToRole) =>
    {
        if (err) {
            res.send(err);
        }
        else {
            res.send(idToRole);
        }
    });
});


router.get('/editTree', (req, res) =>
{
    res.render('userViews/usersAndRolesTree');
});

module.exports = router;
