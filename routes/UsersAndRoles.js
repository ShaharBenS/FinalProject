var express = require('express');
let UsersAndRoles = require('../controllers/UsersAndRoles');
var router = express.Router();

//AddNewRole.
router.post('/addNewRole', function (req, res) {
    let newRoleName = req.body.addNewRole_newRoleName;
    let fatherRoleName = req.body.addNewRole_fatherRoleName;
    UsersAndRoles.addNewRole(newRoleName, fatherRoleName, (err) => {
        if (err) {
            res.send("Role Addition Failed");
        }
        else {
            res.send("Role Addition Success");
        }
    });
});

//AddNewUserToRole.
router.post('/addNewUserToRole', function (req, res) {
    let userEmail = req.body.addNewUserToRole_userEmail;
    let roleName = req.body.addNewUserToRole_roleName;
    UsersAndRoles.addNewUserToRole(userEmail, roleName, (err) => {
        if (err) {
            res.send("User Addition To Role Failed");
        }
        else {
            res.send("User Addition To Role Success");
        }
    });
});

//ChangeRoleName.
router.post('/changeRoleName', function (req, res) {
    let oldRoleName = req.body.changeRoleName_oldRoleName;
    let newRoleName = req.body.changeRoleName_newRoleName;
    UsersAndRoles.changeRoleName(oldRoleName, newRoleName, (err) => {
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
    UsersAndRoles.changeUserEmailInRole(roleName, oldUserEmail, newUserEmail, (err) => {
        if (err) {
            res.send("User Email Change In Role Failed");
        }
        else {
            res.send("User Email Change In Role Success");
        }
    });
});

//DeleteRole.
router.post('/deleteRole', function (req, res) {
    let roleToDelete = req.body.roleToDelete;
    UsersAndRoles.deleteRole(roleToDelete, (err) => {
        if (err) {
            res.send("Role Deletion Failed");
        }
        else {
            res.send("Role Deletion Success");
        }
    });
});

//DeleteUserFromRole.

router.post('/deleteUserFromRole', function (req, res) {
    console.log('Hello');
    let userEmail = req.body.deleteUserFromRole_userEmail;
    let roleName = req.body.deleteUserFromRole_roleName;
    UsersAndRoles.deleteUserFromRole(userEmail, roleName, (err) => {
        if (err) {
            res.send("Delete User From Role Failed");
        }
        else {
            res.send("Delete User From Role Success");
        }
    });
});

router.get('/getAllRoles', (req,res)=>{
    UsersAndRoles.getAllRoles((err,result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
});

router.get('/getAllUsersByRole',(req,res)=>{
    if(req.query.roleName){
        UsersAndRoles.getAllUsersByRole(req.query.roleName, (err,users)=>{
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
    res.render('UsersAndRolesTree');
});

module.exports = router;
