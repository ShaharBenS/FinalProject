var express = require('express');
var router = express.Router();
let processStructure = require('../controllers/processesControllers/processStructureController');
let UsersAndRolesTreeSankey = require('../controllers/usersControllers/usersAndRolesController');
let waitingProcessStructuresController = require("../controllers/processesControllers/waitingProcessStructuresController");
let onlineFormsController = require("../controllers/onlineFormsControllers/onlineFormController");

///RememberDeleteIt.
let sankeyContent = require('../test/inputs/trees/treesForActiveProcessTest/usersTree1sankey');
let emailsToFullName = require('../test/inputs/trees/treesForActiveProcessTest/usersTree1EmailsToFullNames');
let rolesToDereg = require('../test/inputs/trees/treesForActiveProcessTest/usersTree1RolesToDeregs');
let rolesToEmails = require('../test/inputs/trees/treesForActiveProcessTest/usersTree1RolesToEmails');
let processStructureSankeyJSON = require('../test/inputs/processStructures/processStructuresForActiveProcessTest/processStructure1');
///
router.post('/file/save', function (req, res) {
    let userEmail = req.user.emails[0].value;
    if (req.body.context === 'addProcessStructure') {
        onlineFormsController.findOnlineFormsIDsByFormsNames(JSON.parse(req.body.onlineFormsOfProcess), (err, onlineFormsIDs)=>{
            if(err) callback(err);
            else {
                processStructure.addProcessStructure(userEmail, req.body.processStructureName,JSON.stringify(processStructureSankeyJSON), onlineFormsIDs,req.body.automaticAdvanceTime, req.body.notificationTime, (err, needApprove) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        if (needApprove === 'approval') {
                            res.send('success_needApprove');
                        }
                        else {
                            res.send('success');
                        }
                    }
                });
            }
        });
    } else if (req.body.context === 'editProcessStructure') {
        onlineFormsController.findOnlineFormsIDsByFormsNames(JSON.parse(req.body.onlineFormsOfProcess), (err, onlineFormsIDs)=> {
            if(err) callback(err);
            else {
                processStructure.editProcessStructure(userEmail, req.body.processStructureName, req.body.content, onlineFormsIDs, req.body.automaticAdvanceTime, req.body.notificationTime, (err, needApprove) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        if (needApprove === 'approval') {
                            res.send('success_needApprove');
                        }
                        else {
                            res.send('success');
                        }
                    }
                });
            }
        });

    }
    else if(req.body.context === 'viewProcessStructure'){
        onlineFormsController.findOnlineFormsIDsByFormsNames(JSON.parse(req.body.onlineFormsOfProcess), (err, onlineFormsIDs)=> {
            if(err) callback(err);
            else {
                waitingProcessStructuresController.updateStructure(userEmail,req.body.mongoId, req.body.content, onlineFormsIDs,req.body.automaticAdvanceTime, req.body.notificationTime, (err,status) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.send(status);
                    }
                });
            }
        });
    }
    else if (req.body.context === '__tree__') {
        UsersAndRolesTreeSankey.setUsersAndRolesTree(userEmail,JSON.stringify(sankeyContent),
            JSON.parse(JSON.stringify(rolesToEmails)),JSON.parse(JSON.stringify(emailsToFullName)),
            JSON.parse(JSON.stringify(rolesToDereg)), (err) => {
            if (err) {
                res.send(err);
            }
            else{
                res.send('success');
            }
        })
    }
});

router.post('/file/get', function (req, res) {
    if (req.body.diagramContext === '__tree__') {
        UsersAndRolesTreeSankey.getUsersAndRolesTree((err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(JSON.parse(result.sankey))
            }
        });
    }
    else if(req.body.diagramContext === "viewProcessStructure"){
        waitingProcessStructuresController.getWaitingStructureById(req.body.mongoId,(err,waitingStructure)=>{
           if(err){
               res.send(err);
           }
           else{
               res.send(JSON.parse(waitingStructure.sankey));
           }
        });
    }
    else{
        processStructure.getProcessStructure(req.body.id, (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(JSON.parse(result.sankey));
            }
        });
    }
});

router.post('/sankey/weights', function (req, res, next) {
    res.send([{
        file: req.body.id
    }]);
});


module.exports = router;