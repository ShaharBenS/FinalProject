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

        }
        else
        {
            res.send(result.getPermissionsArray());
        }
    });
});

router.post('/setUserPermissions', (req, res) =>
{
    let userPermissions = new UserPermissions(req.body.userEmail,[!!req.body.UserManagementsPermission,
        !!req.body.StructureManagementsPermission,!!req.body.ObserverPermission,!!req.body.PermissionManagementPermission]);
    usersPermissionsController.setUserPermissions(userPermissions,(err,result)=>{
        if(err)
        {

        }
        else
        {
            res.redirect('/permissionsControl');
        }
    });
});

module.exports = router;