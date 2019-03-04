let express = require('express');
let processStructure = require('../../controllers/processesControllers/processStructureController');
let userAndRoles = require('../../controllers/usersControllers/usersAndRolesController');
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
    processStructure.removeProcessStructure(structureName, (result) => res.send(result));
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
    processStructure.getAllProcessStructures((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getFormsToStages', function (req, res) {
    processStructure.getProcessStructure(req.body.processStructureName, (err, processStructure) => {
        if (err) res.send(err);
        else {
            let formsToStages = {};
            let formsOfStages = processStructure.getFormsOfStage();
            formsOfStages.keys().forEach((key) => {
                formsToStages[userAndRoles.getRoleNameByRoleID(key)] = formsOfStages[key];
            });
            res.send(formsToStages);
        }
    })
});

module.exports = router;
