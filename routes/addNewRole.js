let express = require('express');
let addNewRole = require('../controllers/UsersAndRoles/addNewRole');

let router = express.Router();

router.post('/', function (req, res) {
    let newRoleName = req.body.addNewRole_newRoleName;
    let fatherRoleName = req.body.addNewRole_fatherRoleName;
    addNewRole(newRoleName,fatherRoleName,(err) =>
    {
        if (err) {
            res.send("Role Addition Failed");
        }
        else {
            res.send("Role Addition Success");
        }
    });
});
module.exports = router;