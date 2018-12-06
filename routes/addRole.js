let express = require('express');
let addRole = require('../controllers/roles/addRole');

let router = express.Router();

router.post('/', function (req, res) {
    let roleName = req.body.addRole_role;
    addRole(roleName, (err) => {
        if (err) {
            res.send("Role Addition Failed");
        }
        else {
            res.send("Role Addition Success");
        }
    });
});
module.exports = router;