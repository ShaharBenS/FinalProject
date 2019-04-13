var express = require('express');
var router = express.Router();
let processStructure = require('../controllers/processesControllers/processStructureController');
let UsersAndRolesTreeSankey = require('../controllers/usersControllers/usersAndRolesController');
let waitingProcessStructuresController = require("../controllers/processesControllers/waitingProcessStructuresController");
let onlineFormsController = require("../controllers/onlineFormsControllers/onlineFormController");

router.post('/file/save', function (req, res) {
    let userEmail = req.user.emails[0].value;
    if (req.body.context === 'addProcessStructure') {
        onlineFormsController.findOnlineFormsIDsByFormsNames(JSON.parse(req.body.onlineFormsOfProcess), (err, onlineFormsIDs)=>{
            if(err) callback(err);
            else {
                processStructure.addProcessStructure(userEmail, req.body.processStructureName, req.body.content, onlineFormsIDs, (err, needApprove) => {
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
                processStructure.editProcessStructure(userEmail, req.body.processStructureName, req.body.content, onlineFormsIDs, (err, needApprove) => {
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
                waitingProcessStructuresController.updateStructure(req.body.mongoId, req.body.content, onlineFormsIDs, (err) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.send("success");
                    }
                });
            }
        });
    }
    else if (req.body.context === '__tree__') {
        UsersAndRolesTreeSankey.setUsersAndRolesTree(userEmail,req.body.content, JSON.parse(req.body.roleToEmails),JSON.parse(req.body.emailToFullName),JSON.parse(req.body.roleToDereg), (err) => {
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