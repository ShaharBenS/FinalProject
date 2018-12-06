let express = require('express');
let processStructure = require('../controllers/processes/processStructure');
let List = require("collections/list");

let router = express.Router();

router.post('/add', function (req, res) {
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
