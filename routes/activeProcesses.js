let express = require('express');
let activeProcess = require('../controllers/processes/activeProcess');

let router = express.Router();

router.post('/activateProcess', function (req, res) {
    let structure_name = req.body.structure_name;
    let initial_stage = req.body.initial_stage;
    let process_name = req.body.process_name;

    activeProcess.activateProcess(structure_name,process_name,initial_stage, (err)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send("Activated Successfully");
        }
    });
});

router.get('/getAllActiveProcessesByUser', function (req, res) {
    let user_name = req.body.user_name;
    let array_of_processes = [];
    activeProcess.getAllActiveProcessesByUser(user_name,(array)=>{
        array_of_processes = array;
    });
    res.render('MyActiveProcessesPage', {title: 'Express', table : array_of_processes});
});

router.get('/getWaitingActiveProcessesByUser', function (req, res) {
    let user_name = req.body.user_name;
    let array_of_processes = [];
    activeProcess.getWaitingActiveProcessesByUser(user_name,(array)=>{
        array_of_processes = array;
    });
    res.render('MyActiveProcessesPage', {title: 'Express', table : array_of_processes});
});

module.exports = router;
