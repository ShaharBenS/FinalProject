let express = require('express');
let deleteUserByEmail = require('../controllers/users/deleteUserByEmail');

let router = express.Router();

router.post('/', function (req, res) {
    let userEmail = req.body.deleteUserByEmail;
    deleteUserByEmail(userEmail, (err) => {
        if (err) {
            res.send("User Deletion Failed");
        }
        else {
            res.send("User Deletion Success");
        }
    });
});
module.exports = router;