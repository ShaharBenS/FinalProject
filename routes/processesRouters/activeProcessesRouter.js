let express = require('express');
let activeProcess = require('../../controllers/processesControllers/activeProcessController');

let router = express.Router();

/*
  _____   ____   _____ _______
 |  __ \ / __ \ / ____|__   __|
 | |__) | |  | | (___    | |
 |  ___/| |  | |\___ \   | |
 | |    | |__| |____) |  | |
 |_|     \____/|_____/   |_|

 */

router.post('/handleProcess', function (req, res) {
    let userName = req.body.userName;
    let processName = req.body.processName;
    let stage = {stageNum: parseInt(req.body.stageNum), comments: "" , filledForms : "", fileNames : ""};
    activeProcess.handleProcess(userName, processName, stage, [""], [""], (err, ret) => {
        if (err) {
            res.send(err);
        } else {
            res.send("success");
        }
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
    activeProcess.getAllActiveProcessesByUser(userName, (err1, array1) => {
        activeProcess.convertActiveProcessesWithRoleIDToRoleName(array1, (err2, array2) => {
            res.render('activeProcessesViews/myActiveProcessesPage', {table: array1});
        });
    });
});

router.get('/getWaitingActiveProcessesByUser', function (req, res) {
    let userName = req.user.emails[0].value;
    activeProcess.getWaitingActiveProcessesByUser(userName, (err, array) => {
        res.render('activeProcessesViews/myWaitingProcessesPage', {table: array , username : userName});
    });
});

router.get('/handleProcessView', function (req, res) {
    let userName = req.user.emails[0].value;
    let processName = req.query.process_name;
    activeProcess.getNextStagesRoles(processName,userName,(err,rolesArr)=>{
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.render('activeProcessesViews/handleProcess', {userName: userName , processName : processName,
            nextRoles: rolesArr});
        }
    });

});

router.get('/reportProcess', function (req, res) {
    let process_name = req.query.process_name;
    activeProcess.getAllActiveProcessDetails(process_name, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.render('reportsViews/ProcessReport', {processDetails: result[0], table: result[1]});
        }
    });
});

router.get('/processStartPage', function (req, res) {
    res.render('processStartPage');
});
/*router.get('/myActiveProcessesPage', function (req, res) {
    res.render('activeProcessesViews/myActiveProcessesPage');
});*/
router.get('/myWaitingProcessesPage', function (req, res) {
    res.render('activeProcessesViews/myWaitingProcessesPage');
});

module.exports = router;
