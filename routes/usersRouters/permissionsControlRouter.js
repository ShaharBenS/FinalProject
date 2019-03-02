let express = require('express');
let router = express.Router();
router.get('/', (req, res) =>
{
    res.render('userViews/UsersPermissionsControl');
});

module.exports = router;