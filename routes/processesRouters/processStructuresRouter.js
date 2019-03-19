let express = require('express');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let userAndRoles = require('../../controllers/usersControllers/usersAndRolesController');
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');

let router = express.Router();

/*
  _____   ____   _____ _______
 |  __ \ / __ \ / ____|__   __|
 | |__) | |  | | (___    | |
 |  ___/| |  | |\___ \   | |
 | |    | |__| |____) |  | |
 |_|     \____/|_____/   |_|

 */

router.post('/removeProcessStructure', function (req, res) {
    let structureName = req.body.structureName;
    processStructureController.removeProcessStructure(structureName, (result) => res.send(result));
});

/*
   _____ ______ _______
  / ____|  ____|__   __|
 | |  __| |__     | |
 | | |_ |  __|    | |
 | |__| | |____   | |
  \_____|______|  |_|

 */

router.get('/addProcessStructure', function (req, res) {
    if (req.query.name) {
        res.render('processesStructureViews/ProcessStructure', {
            processStructureName: req.query.name,
            pageContext: 'addProcessStructure'
        });
    } else {
        res.send("Missing structure name.")
    }
});

router.get('/editProcessStructure', function (req, res) {
    if (req.query.name) {
        res.render('processesStructureViews/ProcessStructure', {
            processStructureName: req.query.name,
            pageContext: 'editProcessStructure'
        })
    } else {
        res.send("Missing structure name.")
    }
});

router.get('/getAllProcessStructures', function (req, res) {
    processStructureController.getAllProcessStructures((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getFormsToStages', function (req, res) {
    let structureName = req.query.processStructureName;
    processStructureController.getFormsToStages(structureName, (err, formsToStages) => {
        if (err) res.send(err);
        else res.send(formsToStages);
    });
});

module.exports = router;
