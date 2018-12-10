let express = require('express');
let HELPER = require("../controllers/processes/helperFunctions");
let processStructure = require('../controllers/processes/processStructure');

let router = express.Router();

router.get('/addProcessStructure', function (req, res) {
    /*let structure_name = req.body.structure_name;
    let initials = req.body.initials;
    let stages =  req.body.stages;*/

    //TODO: this is only test, remember to refactoring
    let structure_name = 'structure 1';
    let initials = [1, 2];

    let stages;

    HELPER.getRoleName_by_username("omri@post.bgu.ac.il", (id1) => {
        HELPER.getRoleName_by_username("kuti@post.bgu.ac.il", (id2) => {
            HELPER.getRoleName_by_username("tomer@post.bgu.ac.il", (id3) => {
                HELPER.getRoleName_by_username("shahar@post.bgu.ac.il", (id4) => {
                    stages = [
                        {
                            roleName: id1,
                            stageNum: 1,
                            nextStages: [2],
                            stagesToWaitFor: [],
                            online_forms: [],
                            attached_files_names: []
                        },
                        {
                            roleName: id2,
                            stageNum: 2,
                            nextStages: [3],
                            stagesToWaitFor: [1],
                            online_forms: [],
                            attached_files_names: []
                        },
                        {
                            roleName: id3,
                            stageNum: 3,
                            nextStages: [4],
                            stagesToWaitFor: [2],
                            online_forms: [],
                            attached_files_names: []
                        },
                        {
                            roleName: id4,
                            stageNum: 4,
                            nextStages: [],
                            stagesToWaitFor: [3],
                            online_forms: [],
                            attached_files_names: []
                        }
                    ];


                    processStructure.addProcessStructure(structure_name, initials, stages, (err) => {
                        if (err)
                            res.send("fail");
                        else res.send("success");
                    });
                })
            })
        })
    });
});

router.post('/editProcessStructure', function (req, res) {
    let structure_name = req.body.structure_name;
    let initials = req.body.initials;
    let stages = req.body.stages;
    processStructure.editProcessStructure(structure_name, initials, stages, (result) => res.send(result));
});

router.post('/removeProcessStructure', function (req, res) {
    let structure_name = req.body.structure_name;
    processStructure.removeProcessStructure(structure_name, (result) => res.send(result));
});

module.exports = router;
