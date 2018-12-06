let express = require('express');
let deleteUserByRole = require('../controllers/users/deleteUserByRole');

let router = express.Router();

router.post('/', function (req, res) {
    let userRole = req.body.deleteUserByRole;
    deleteUserByRole(userRole, (err) => {
        if (err) {
            res.send("User Deletion Failed");
        }
        else {
            res.send("User Deletion Success");
        }
    });
});
module.exports = router;