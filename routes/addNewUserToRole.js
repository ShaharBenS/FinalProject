let express = require('express');
let addNewUserToRole = require('../controllers/UsersAndRoles/addNewUserToRole');

let router = express.Router();

router.post('/', function (req, res) {
    let userEmail = req.body.addNewUserToRole_userEmail;
    let roleName = req.body.addNewUserToRole_roleName;
    addNewUserToRole(userEmail,roleName,(err) =>
    {
        if (err) {
            res.send("User Addition To Role Failed");
        }
        else {
            res.send("User Addition To Role Success");
        }
    });
});
module.exports = router;