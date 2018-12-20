var express = require('express');
var router = express.Router();
let processStructure = require('../controllers/processes/processStructure');

router.post('/file/save',function (req,res) {
    if(req.body.context === 'add_process_structure'){
        processStructure.addProcessStructure(req.body.process_structure_name,req.body.content,(err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send('okay'); //TODO: redirect to index
            }
        });
    }
    if(req.body.context === 'edit_process_structure'){
        processStructure.editProcessStructure(req.body.process_structure_name,req.body.content, (err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send('okay');
            }
        })
    }
});

router.post('/file/get',function (req,res) {
    processStructure.getProcessStructure(req.body.id,(err,result)=>{
        if(err){
            console.log(err);
            res.send(err);
        }
        else{
            res.send(JSON.parse(result.sankey));
        }
    });
});

router.post('/sankey/weights',function (req,res,next) {
    res.send([{
        file: req.body.id
    }]);
});



module.exports = router;