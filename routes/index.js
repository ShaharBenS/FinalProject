let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('http://localhost:3000/auth/google');
});

module.exports = router;