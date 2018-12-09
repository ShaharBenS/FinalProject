let express = require('express');
let activeProcess = require('../controllers/processes/activeProcess');

let router = express.Router();

router.post('/startProcess', function (req, res) {
    /* let structure_name = req.body.structure_name;
     let initial_stage = req.body.initial_stage;
     let process_name = req.body.process_name;
 */
    let structure_name = "structure 1";
    let process_name = "active process 1";
    let username = "omri@post.bgu.ac.il";
    activeProcess.startProcessByUsername(username, structure_name, process_name, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Activated Successfully");
        }
    });
});

router.get('/getAllActiveProcessesByUser', function (req, res) {
    let user_name = req.body.user_name;
    activeProcess.getAllActiveProcessesByUser(user_name, (array) => {
        res.render('MyActiveProcessesPage', {title: 'Express', table: array});
    });
});

router.get('/getWaitingActiveProcessesByUser', function (req, res) {
    let user_name = req.body.user_name;
    activeProcess.getWaitingActiveProcessesByUser(user_name, (array) => {
        res.render('MyWaitingProcessesPage', {title: 'Express', table: array});
    });
});

module.exports = router;
