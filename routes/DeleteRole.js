let express = require('express');
let deleteRole = require('../controllers/roles/deleteRole');

let router = express.Router();

router.post('/', function (req, res) {
    let roleName = req.body.deleteRole_role;
    deleteRole(roleName, (err) => {
        if (err) {
            res.send("Role Deletion Failed");
        }
        else {
            res.send("Role Deletion Success");
        }
    });
});
module.exports = router;