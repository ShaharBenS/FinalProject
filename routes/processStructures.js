let express = require('express');
let processStructure = require('../controllers/processes/processStructure');

let router = express.Router();

router.post('/addProcessStructure', function (req, res) {
    let structure_name = req.body.structure_name;
    let initials = req.body.initials;
    let stages =  req.body.stages;
    processStructure.addProcessStructure(structure_name, initials, stages, (result)=> res.send(result));
});

router.post('/editProcessStructure', function (req, res) {
    let structure_name = req.body.structure_name;
    let initials = req.body.initials;
    let stages =  req.body.stages;
    processStructure.editProcessStructure(structure_name, initials, stages, (result)=> res.send(result));
});

router.post('/removeProcessStructure', function (req, res) {
    let structure_name = req.body.structure_name;
    processStructure.removeProcessStructure(structure_name,(result)=> res.send(result));
});

/* HTML Pages */
router.get('/addProcessStructure', function (req, res) {
    if(req.query.name){
        res.render('AddProcessStructure',{process_structure_name:req.query.name});
    }
    else{
        res.send("Missing structure name.")
    }
});


module.exports = router;
