let express = require('express');
let processStructure = require('../controllers/processes/processStructure');

let router = express.Router();

router.post('/removeProcessStructure', function (req, res) {
    let structure_name = req.body.structure_name;
    processStructure.removeProcessStructure(structure_name,(result)=> res.send(result));
});

/* HTML Pages */
router.get('/addProcessStructure', function (req, res) {
    if(req.query.name){
        res.render('ProcessStructure',{process_structure_name:req.query.name,page_context: 'add_process_structure'});
    }
    else{
        res.send("Missing structure name.")
    }
});

router.get('/editProcessStructure',function (req,res){
    if(req.query.name){
        res.render('ProcessStructure',{process_structure_name: req.query.name, page_context: 'edit_process_structure'})
    }
    else{
        res.send("Missing structure name.")
    }
});

module.exports = router;
