let express = require('express');
let changeUserEmailInRole = require('../controllers/UsersAndRoles/changeUserEmailInRole');

let router = express.Router();

router.post('/', function (req, res) {
    let roleName = req.body.changeUserEmailInRole_roleName;
    let oldUserEmail = req.body.changeUserEmailInRole_oldUserEmail;
    let newUserEmail = req.body.changeUserEmailInRole_newUserEmail;
    changeUserEmailInRole(roleName, oldUserEmail, newUserEmail, (err) => {
        if (err) {
            res.send("User Email Change In Role Failed");
        }
        else {
            res.send("User Email Change In Role Success");
        }
    });
});
module.exports = router;