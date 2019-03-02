var express = require('express');
var router = express.Router();
let processStructure = require('../controllers/processesControllers/processStructureController');
let UsersAndRolesTreeSankey = require('../controllers/usersControllers/usersAndRolesController');

router.post('/file/save',function (req,res) {
    if(req.body.context === 'addProcessStructure'){
        processStructure.addProcessStructure(req.body.processStructureName,req.body.content,(err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send('success'); //TODO: redirect to index
            }
        });
    }
    else if(req.body.context === 'editProcessStructure'){
        processStructure.editProcessStructure(req.body.processStructureName,req.body.content, (err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send('success');
            }
        })
    }
    else if(req.body.context === '__tree__'){
        UsersAndRolesTreeSankey.setUsersAndRolesTree(req.body.content,JSON.parse(req.body.roleToEmails),(err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send('success');
            }
        })
    }
});

router.post('/file/get',function (req,res) {
    if(req.body.id === '__tree__'){
        UsersAndRolesTreeSankey.getUsersAndRolesTree((err,result)=>{
           if(err){
               res.send(err);
           }
           else{
               res.send(JSON.parse(result.sankey))
           }
        });
    }
    else{
        processStructure.getProcessStructure(req.body.id,(err,result)=>{
            if(err){
                console.log(err);
                res.send(err);
            }
            else{
                res.send(JSON.parse(result.sankey));
            }
        });
    }
});

router.post('/sankey/weights',function (req,res,next) {
    res.send([{
        file: req.body.id
    }]);
});



module.exports = router;