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

router.post('/addNewRole', function (req, res) {
    let newRoleName = req.body.addNewRole_newRoleName;
    let fatherRoleName = req.body.addNewRole_fatherRoleName;
    UsersAndRolesController.addNewRole(newRoleName, fatherRoleName, (err) => {
        if (err) {
            res.send("Role Addition Failed");
        }
        else {
            res.send("Role Addition Success");
        }
    });
});


router.post('/addNewUserToRole', function (req, res) {
    let userEmail = req.body.addNewUserToRole_userEmail;
    let roleName = req.body.addNewUserToRole_roleName;
    UsersAndRolesController.addNewUserToRole(userEmail, roleName, (err) => {
        if (err) {
            res.send("User Addition To Role Failed");
        }
        else {
            res.send("User Addition To Role Success");
        }
    });
});

router.post('/changeRoleName', function (req, res) {
    let oldRoleName = req.body.changeRoleName_oldRoleName;
    let newRoleName = req.body.changeRoleName_newRoleName;
    UsersAndRolesController.changeRoleName(oldRoleName, newRoleName, (err) => {
        if (err) {
            res.send("Role Change Name Failed");
        }
        else {
            res.send("Role Change Name Success");
        }
    });
});

//ChangeUserEmailInRole.
router.post('/changeUserEmailInRole', function (req, res) {
    let roleName = req.body.changeUserEmailInRole_roleName;
    let oldUserEmail = req.body.changeUserEmailInRole_oldUserEmail;
    let newUserEmail = req.body.changeUserEmailInRole_newUserEmail;
    UsersAndRolesController.changeUserEmailInRole(roleName, oldUserEmail, newUserEmail, (err) => {
        if (err) {
            res.send("User Email Change In Role Failed");
        }
        else {
            res.send("User Email Change In Role Success");
        }
    });
});

router.post('/deleteRole', function (req, res) {
    let roleToDelete = req.body.roleToDelete;
    UsersAndRolesController.deleteRole(roleToDelete, (err) => {
        if (err) {
            res.send("Role Deletion Failed");
        }
        else {
            res.send("Role Deletion Success");
        }
    });
});

router.post('/deleteUserFromRole', function (req, res) {
    let userEmail = req.body.deleteUserFromRole_userEmail;
    let roleName = req.body.deleteUserFromRole_roleName;
    UsersAndRolesController.deleteUserFromRole(userEmail, roleName, (err) => {
        if (err) {
            res.send("Delete User From Role Failed");
        }
        else {
            res.send("Delete User From Role Success");
        }
    });
});

/*
   _____ ______ _______
  / ____|  ____|__   __|
 | |  __| |__     | |
 | | |_ |  __|    | |
 | |__| | |____   | |
  \_____|______|  |_|

 */

router.get('/getAllRoles', (req,res)=>{
    UsersAndRolesController.getAllRoles((err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
});

router.get('/getRoleToEmails',(req,res)=>{
   UsersAndRolesController.getRoleToEmails((err,roleToEmails)=>{
       if(err){
           res.send(err);
       }
       else{
           res.send(roleToEmails);
       }
   });
});

router.get('/getAllUsersByRole',(req,res)=>{
    if(req.query.roleName){
        UsersAndRolesController.getAllUsersByRole(req.query.roleName, (err, users)=>{
            if(err){
                console.log(err);
                res.send(err);
            }
            else{
                res.send(users);
            }
        })
    }
});

router.get('/editTree',(req,res)=>{
    res.render('userViews/usersAndRolesTree');
});

module.exports = router;
