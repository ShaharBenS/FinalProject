let express = require('express');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let userAndRoles = require('../../controllers/usersControllers/usersAndRolesController');
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');
let waitingProcessStructuresController = require('../../controllers/processesControllers/waitingProcessStructuresController');

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

router.post('/approveStructure', function (req,res){
    if(req.body.mongoId){
            waitingProcessStructuresController.approveProcessStructure(req.user.emails[0].value,req.body.mongoId,(err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send("success")
            }
        })
    }
    else{
        res.send("Error: no id specified")
    }
});

router.post('/disapproveStructure', function (req,res){
    if(req.body.mongoId){
        waitingProcessStructuresController.disapproveProcessStructure(req.user.emails[0].value,req.body.mongoId,(err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send("success")
            }
        })
    }
    else{
        res.send("Error: no id specified")
    }
});


/*
   _____ ______ _______
  / ____|  ____|__   __|
 | |  __| |__     | |
 | | |_ |  __|    | |
 | |__| | |____   | |
  \_____|______|  |_|

 */

router.get('/waitingForApproval', (req,res)=>{
    waitingProcessStructuresController.getAllWaitingProcessStructuresWithoutSankey((err, waitingStructures)=>{
        res.render('processesStructureViews/waitingStructures',{waitingStructures:waitingStructures});
    });
});

router.get('/addProcessStructure', function (req, res) {
    if (req.query.name) {
        res.render('processesStructureViews/ProcessStructure', {
            processStructureName: req.query.name,
            pageContext: 'addProcessStructure',
            mongoId: '',
        });
    } else {
        res.send("Missing structure name.")
    }
});

router.get('/editProcessStructure', function (req, res) {
    if (req.query.name) {
        res.render('processesStructureViews/ProcessStructure', {
            processStructureName: req.query.name,
            pageContext: 'editProcessStructure',
            mongoId: '',
        })
    } else {
        res.send("Missing structure name.")
    }
});

router.get('/viewWaitingProcessStructure', function (req, res) {
    if (req.query.mongoId) {
        res.render('processesStructureViews/ProcessStructure', {
            processStructureName: 'noName',
            pageContext: 'viewProcessStructure',
            mongoId: req.query.mongoId,
        });
    } else {
        res.send("Missing structure name.")
    }
});

router.get('/getAllProcessStructures', function (req, res) {
    let userEmail = req.user.emails[0].value;
    processStructureController.getAllProcessStructures((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

router.get('/getAllProcessStructuresTakenNames', function (req, res) {
    processStructureController.getAllProcessStructuresTakenNames((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});


router.get('/getFormsOfProcess', function (req, res) {
    if(req.query.fromWaiting === 'true' && req.query.mongoId){
        waitingProcessStructuresController.getWaitingStructureById(req.query.mongoId,(err,waitingStructure)=>{
            if(err){
                res.send(err);
            }
            else{
                onlineFormsController.findOnlineFormsNamesByFormsIDs(waitingStructure.onlineForms,(err,formsNames)=>{
                    if(err) callback(err);
                    else {
                        res.send(formsNames);
                    }
                });
            }
        })
    }
    else if(req.query.fromWaiting === 'false') {
        processStructureController.getProcessStructure(req.query.processStructureName, (err, processStructure) => {
            if (err) res.send(err);
            else {
                if (processStructure !== null)
                {
                    onlineFormsController.findOnlineFormsNamesByFormsIDs(processStructure.onlineForms,(err,formsNames)=>{
                        if(err) callback(err);
                        else {
                            res.send(formsNames);
                        }
                    });
                }
                else res.send([]);
            }
        })
    }
});

module.exports = router;
