let express = require('express');
let activeProcess = require('../../controllers/processesControllers/activeProcessController');
let router = express.Router();
let formidable = require('formidable');


/*
  _____   ____   _____ _______
 |  __ \ / __ \ / ____|__   __|
 | |__) | |  | | (___    | |
 |  ___/| |  | |\___ \   | |
 | |    | |__| |____) |  | |
 |_|     \____/|_____/   |_|

 */

router.post('/handleProcess', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let userEmail = req.user.emails[0].value;
        let processName = fields.processName;
        activeProcess.uploadFilesAndHandleProcess(userEmail, processName, fields, files, (err, ret) => {
            if (err) {
                res.send(err);
            } else {
                res.send("success");
            }
        });
    });
});

router.post('/returnToProcessCreator', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        let userEmail = req.user.emails[0].value;
        let processName = fields.processName;
        let comments = fields.comments;
        activeProcess.returnToCreator(userEmail,processName,comments, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("success");
            }
        });
    });
});

router.post('/takePartInProcess', function (req, res) {
    let process_name = req.body.process_name;
    let userEmail = req.body.user_email;
    activeProcess.takePartInActiveProcess(process_name, userEmail, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send("success");
        }
    });
});

router.post('/unTakePartInProcess', function (req, res) {
    let process_name = req.body.process_name;
    let userEmail = req.body.user_email;
    activeProcess.unTakePartInActiveProcess(process_name, userEmail, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send("success");
        }
    });
});

router.post('/startProcess', function (req, res) {
    let structureName = req.body.structureName;
    let processName = req.body.processName;
    let username = req.user.emails[0].value;
    activeProcess.startProcessByUsername(username, structureName, processName, (err) => {
        if (err) {
            res.send(err.message);
        } else {
            res.send("success");
        }
    });
});

/*
   _____ ______ _______
  / ____|  ____|__   __|
 | |  __| |__     | |
 | | |_ |  __|    | |
 | |__| | |____   | |
  \_____|______|  |_|

 */

router.get('/getAllActiveProcessesByUser', function (req, res) {
    let userName = req.user.emails[0].value;
    activeProcess.getAllActiveProcessesByUser(userName, (err, array) => {
        handleRolesAndStages(array);
        activeProcess.convertDate(array[0]);
        res.render('activeProcessesViews/myActiveProcessesPage', {activeProcesses: array[0]});
    });
});

function handleRolesAndStages(array) {
    for (let i = 0; i < array[0].length; i++) {
        let currentStages = array[0][i]._currentStages;
        array[0][i]._currentStages = [];
        for (let j = 0; j < array[0][i]._stages.length; j++) {
            if (currentStages.includes(array[0][i]._stages[j].stageNum)) {
                array[0][i]._currentStages.push(array[0][i]._stages[j]);
            }
        }
    }
    for (let i = 0; i < array[0].length; i++) {
        for (let j = 0; j < array[0][i]._currentStages.length; j++) {
            array[0][i]._currentStages[j].roleID = array[1][i][j];
        }
    }
}

router.get('/getWaitingActiveProcessesByUser', function (req, res) {
    let userName = req.user.emails[0].value;
    activeProcess.getWaitingActiveProcessesByUser(userName, (err, array) => {
        handleRolesAndStages(array);
        activeProcess.convertDate(array[0]);
        res.render('activeProcessesViews/myWaitingProcessesPage', {waitingProcesses: array[0], username: userName});
    });
});

router.get('/handleProcessView', function (req, res) {
    let userName = req.user.emails[0].value;
    let processName = req.query.process_name;
    activeProcess.getNextStagesRoles(processName, userName, (err, rolesArr) => {
        if (err) {
            res.send(err);
        }
        else {
            res.render('activeProcessesViews/handleProcess', {
                userName: userName, processName: processName,
                nextRoles: rolesArr
            });
        }
    });

});

router.get('/reportProcess', function (req, res) {
    let process_name = req.query.process_name;
    activeProcess.getAllActiveProcessDetails(process_name, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            activeProcess.convertJustCreationTime(result[0]);
            res.render('reportsViews/ProcessReport', {processDetails: result[0], table: result[1]});
        }
    });
});

router.get('/processStartPage', function (req, res) {
    res.render('processStartPage');
});

router.get('/myWaitingProcessesPage', function (req, res) {
    res.render('activeProcessesViews/myWaitingProcessesPage');
});


module.exports = router;
