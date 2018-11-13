let express = require('express');
let addUser = require('../controllers/users/addUser');

let router = express.Router();

router.post('/', function (req, res) {
    let username = req.body.register_username;
    let password = req.body.register_password;

    addUser(username, password, (err)=>{
        if(err){
            res.send("registered failed");
        }
        else{
            res.send("registered successfully");
        }
    });
});


module.exports = router;
