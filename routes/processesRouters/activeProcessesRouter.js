let express = require('express');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let filledOnlineFormsController = require('../../controllers/onlineFormsControllers/filledOnlineFormController');
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
        activeProcessController.uploadFilesAndHandleProcess(userEmail, fields, files, (err, ret) => {
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
        activeProcessController.returnToCreator(userEmail, processName, comments, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("success");
            }
        });
    });
});

router.post('/takePartInProcess', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        let userEmail = req.user.emails[0].value;
        let processName = fields.processName;
        activeProcessController.takePartInActiveProcess(processName, userEmail, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("success");
            }
        });
    });
});

router.post('/unTakePartInProcess', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        let userEmail = req.user.emails[0].value;
        let processName = fields.processName;
        activeProcessController.unTakePartInActiveProcess(processName,userEmail, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("success");
            }
        });
    });
});

router.post('/startProcess', function (req, res) {
    let structureName = req.body.structureName;
    let processName = req.body.processName;
    let processDate = req.body.processDate;
    let processUrgency = req.body.processUrgency;
    let username = req.user.emails[0].value;
    let notificationTime = req.body.notificationTime;
    activeProcessController.startProcessByUsername(username, structureName, processName,processDate, processUrgency,notificationTime, (err) => {
        if (err) {
            res.send(err.message);
        } else {
            res.send("success");
        }
    });
});

router.post('/cancelProcess', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        let userEmail = req.user.emails[0].value;
        let processName = fields.processName;
        let comments = fields.comments;
        activeProcessController.cancelProcess(userEmail, processName, comments, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("success");
            }
        });
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
    activeProcessController.getAllActiveProcessesByUser(userName, (err, array) => {
        if (err) res.send(err);
        handleRolesAndStages(array);
        activeProcessController.convertDate(array[0]);
        activeProcessController.convertDate2(array[0]);
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
    if(array[2] !== undefined)
    {
        for(let i=0;i<array[0].length;i++)
        {
            array[0][i]._child = array[2][i];
        }
    }
}

router.get('/getWaitingActiveProcessesByUser', function (req, res) {
    let userName = req.user.emails[0].value;
    activeProcessController.getWaitingActiveProcessesByUser(userName, (err, array) => {
        handleRolesAndStages(array);
        activeProcessController.convertDate(array[0]);
        res.render('activeProcessesViews/myWaitingProcessesPage', {waitingProcesses: array[0], username: userName});
    });
});

router.get('/getAvailableActiveProcessesByUser', function (req, res) {
    let userName = req.user.emails[0].value;
    activeProcessController.getAvailableActiveProcessesByUser(userName, (err, array) => {
        res.render('activeProcessesViews/myAvailableProcessesPage', {availableProcesses: array, username: userName});
    });
});

router.get('/handleProcessView', function (req, res) {
    let userName = req.user.emails[0].value;
    let processName = req.query.process_name;
    activeProcessController.getNextStagesRolesAndOnlineForms(processName, userName, (err, rolesArr) => {
        if (err) {
            res.send(err);
        } else {
            res.render('activeProcessesViews/handleProcess', {
                userName: userName, processName: processName,
                nextRoles: rolesArr[0], formsNames: rolesArr[1]
            });
        }
    });
});

router.get('/reportProcess', function (req, res) {
    let process_name = req.query.process_name;
    activeProcessController.processReport(process_name, (err, result) => {
        if (err) res.send(err);
        else
            res.render('reportsViews/processReport', {
                processDetails: result[0],
                table: result[1]
            });
    })
});

router.get('/processStartPage', function (req, res) {
    res.render('processStartPage');
});

router.get('/myWaitingProcessesPage', function (req, res) {
    res.render('activeProcessesViews/myWaitingProcessesPage');
});


module.exports = router;
