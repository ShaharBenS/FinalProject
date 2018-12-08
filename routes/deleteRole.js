let express = require('express');
let deleteRole = require('../controllers/UsersAndRoles/deleteRole');

let router = express.Router();

router.post('/', function (req, res) {
    let roleToDelete = req.body.roleToDelete;
    deleteRole(roleToDelete, (err) => {
        if (err) {
            res.send("Role Deletion Failed");
        }
        else {
            res.send("Role Deletion Success");
        }
    });
});
module.exports = router;