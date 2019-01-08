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


router.get('/editTree',(req,res)=>{
    res.render('userViews/usersAndRolesTree');
});

module.exports = router;
