let express = require('express');
let addUser = require('../controllers/users/addUser');

let router = express.Router();

router.post('/', function (req, res) {
    let userEmail = req.body.addUser_1;
    let userRole = req.body.addUser_2;
    addUser(userEmail,userRole, (err) => {
        if (err) {
            res.send("User Added Failed");
        }
        else {
            res.send("User Added Success");
        }
    });
});
module.exports = router;