let express = require('express');
let editUserEmail = require('../controllers/users/editUserEmail');

let router = express.Router();

router.post('/', function (req, res) {
    let oldUserEmail = req.body.editUser1_email;
    let newUserEmail = req.body.editUser1_email;
    editUserEmail(oldUserEmail,newUserEmail, (err) => {
        if (err) {
            res.send("Email Edit Failed");
        }
        else {
            res.send("Email Edit Success");
        }
    });
});
module.exports = router;