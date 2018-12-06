let express = require('express');
let editRole = require('../controllers/roles/editRole');

let router = express.Router();

router.post('/', function (req, res) {
    let oldRoleName = req.body.editRole1_role;
    let newRoleName = req.body.editRole2_role;
    editRole(oldRoleName,newRoleName, (err) => {
        if (err) {
            res.send("Role Edit Failed");
        }
        else {
            res.send("Role Edit Success");
        }
    });
});
module.exports = router;