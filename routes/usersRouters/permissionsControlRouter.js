let express = require('express');
let router = express.Router();
let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController.js');
let usersPermissionsController = require('../../controllers/usersControllers/UsersPermissionsController.js');
let UserPermissions = require('../../domainObjects/UserPermissions');

router.get('/', (req, res) =>
{
    usersAndRolesController.getAllUsers((err,result)=>{
       if(err)
       {
           res.send(err);
       }
       else
       {
           res.render('userViews/UsersPermissionsControl',{users: result});
       }
    });
});

router.get('/getUserPermissions', (req, res) =>
{
    let userEmail = req.query.userEmail;
    usersPermissionsController.getUserPermissions(userEmail,(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send(result.getPermissionsArray());
        }
    });
});

router.post('/setUserPermissions', (req, res) =>
{
    let userPermissions = new UserPermissions(req.body.userEmail,[req.body.userManagementPermission === "true",
        req.body.structureManagementPermission === "true" ,req.body.observerPermission === "true",req.body.permissionManagementPermission === "true"]);
    usersPermissionsController.setUserPermissions(req.user.emails[0].value, userPermissions,(err)=>{
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send('success');
        }
    });
});

module.exports = router;