let express = require('express');
let changeRoleName = require('../controllers/UsersAndRoles/changeRoleName');

let router = express.Router();

router.post('/', function (req, res) {
    let oldRoleName = req.body.changeRoleName_oldRoleName;
    let newRoleName = req.body.changeRoleName_newRoleName;
    changeRoleName(oldRoleName, newRoleName, (err) => {
        if (err) {
            res.send("Role Change Name Failed");
        }
        else {
            res.send("Role Change Name Success");
        }
    });
});
module.exports = router;