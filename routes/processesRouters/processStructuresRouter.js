let express = require('express');
let processStructure = require('../../controllers/processesControllers/processStructureController');

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
    if(req.query.name){
        res.render('processesStructureViews/ProcessStructure',{processStructureName:req.query.name,pageContext: 'addProcessStructure'});
    }
    else{
        res.send("Missing structure name.")
    }
});

router.get('/editProcessStructure',function (req,res){
    if(req.query.name){
        res.render('processesStructureViews/ProcessStructure',{processStructureName: req.query.name, pageContext: 'editProcessStructure'})
    }
    else{
        res.send("Missing structure name.")
    }
});

module.exports = router;
