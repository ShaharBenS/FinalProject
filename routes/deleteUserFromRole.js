let express = require('express');
let deleteUserFromRole = require('../controllers/UsersAndRoles/deleteUserFromRole');

let router = express.Router();

router.post('/', function (req, res) {
    let userEmail = req.body.deleteUserFromRole_userEmail;
    let roleName = req.body.deleteUserFromRole_roleName;
    deleteUserFromRole(userEmail, roleName, (err) => {
        if (err) {
            res.send("Delete User From Role Failed");
        }
        else {
            res.send("Delete User From Role Success");
        }
    });
});
module.exports = router;