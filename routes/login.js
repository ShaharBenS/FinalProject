let express = require('express');
let loginUser = require('../controllers/users/loginUser');

let router = express.Router();

router.post('/', function (req, res, next) {
    let username = req.body.login_username;
    let password = req.body.login_password;

    let ans = loginUser(username, password, (err)=>{
        if(err){
            res.send("login failed");
        }
        else{
            res.send("login successfully");
        }
    });
    if(ans)
    {
        res.redirect('/main');
    }
    else
    {
        res.redirect('/main');
    }
});

module.exports = router;