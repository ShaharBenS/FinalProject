let express = require('express');
let editUserRole = require('../controllers/users/editUserRole');

let router = express.Router();

router.post('/', function (req, res) {
    let oldUserRole = req.body.editUser1_role;
    let newUserRole = req.body.editUser1_role;
    editUserRole(oldUserRole,newUserRole, (err) => {
        if (err) {
            res.send("Email Edit Failed");
        }
        else {
            res.send("Email Edit Success");
        }
    });
});
module.exports = router;