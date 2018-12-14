let express = require('express');
let activeProcess = require('../controllers/processes/activeProcess');

let router = express.Router();

router.post('/startProcess', function (req, res) {
    let structure_name = req.body.structure_name;
    let process_name = req.body.process_name;
    let username = req.body.user_name;
    activeProcess.startProcessByUsername(username, structure_name, process_name, (err,activeProcess) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Activated Successfully");
        }
    });
});

router.get('/getAllActiveProcessesByUser', function (req, res) {
    let user_name = req.query.user_name;
    activeProcess.getAllActiveProcessesByUser(user_name, (err,array) => {
        res.render('MyActiveProcessesPage', {title: 'Express', table: array});
    });
});

router.get('/getWaitingActiveProcessesByUser', function (req, res) {
    let user_name = req.query.user_name;
    activeProcess.getWaitingActiveProcessesByUser(user_name, (err,array) => {
        res.render('MyWaitingProcessesPage', {title: 'Express', table: array});
    });
});

module.exports = router;
