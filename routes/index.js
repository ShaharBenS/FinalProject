let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('http://localhost:3000/auth/google');
});
//TODO: change localhost:3000 to the real host name.
module.exports = router;