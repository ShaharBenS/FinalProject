let express = require('express');
let HELPER = require("../controllers/processes/helperFunctions");
let processStructure = require('../controllers/processes/processStructure');
let userControl = require('../controllers/UsersAndRoles');

let router = express.Router();

router.post('/removeProcessStructure', function (req, res) {
    let structure_name = req.body.structure_name;
    processStructure.removeProcessStructure(structure_name, (result) => res.send(result));
});

/* HTML Pages */
router.get('/addProcessStructure', function (req, res) {
    res.render('AddProcessStructure');
});


module.exports = router;
