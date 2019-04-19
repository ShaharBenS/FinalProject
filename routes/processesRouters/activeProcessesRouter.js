let express = require('express');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let processReportController = require('../../controllers/processesControllers/processReportController');
let usersAccessor = require('../../models/accessors/usersAccessor');
let filledOnlineFormsController = require('../../controllers/onlineFormsControllers/filledOnlineFormController');
let router = express.Router();
let formidable = require('formidable');
let moment = require('moment');
let userAccessor = require('../../models/accessors/usersAccessor');


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
            if (err) res.render('errorsViews/error');
            else {
                res.send('success');
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
            if (err) res.render('errorViews/error');
            else {
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
            if (err) res.render('errorViews/error');
            else {
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
        activeProcessController.unTakePartInActiveProcess(processName, userEmail, (err) => {
            if (err) res.render('errorViews/error');
            else {
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
    activeProcessController.startProcessByUsername(username, structureName, processName, processDate, processUrgency, notificationTime, (err) => {
        if (err) res.render('errorViews/error');
        else {
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
            if (err) res.render('errorViews/error');
            else {
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
function replaceRoleIDWithRoleNameAndUserEmailWithUserName(activeProcesses, callback) {
    userAccessor.findRole({}, (err, roles) => {
        if (err) {
            callback(err);
        } else {
            userAccessor.findUsername({}, (err2, userNames) => {
                if (err2) {
                    callback(err2);

                }
                else {
                    let roleIDToRoleName = {};
                    roles.forEach(role => {
                        roleIDToRoleName[role._id.toString()] = role.roleName
                    });
                    let userEmailToUserName = {};
                    userNames.forEach(userName => {
                        userEmailToUserName[userName.userEmail] = userName.userName;
                    });
                    callback(null, activeProcesses.map(activeProcess => {
                        activeProcess.stages.forEach(stage => {
                            stage.roleName = roleIDToRoleName[stage.roleID];
                            stage.userName = userEmailToUserName[stage.userEmail];
                        });
                        return activeProcess;
                    }));
                }
            });
        }
    })
}


router.get('/getAllActiveProcessesByUser', function (req, res) {
    let userName = req.user.emails[0].value;
    activeProcessController.getAllActiveProcessesByUser(userName, (err, array) => {
        if (err) res.render('errorViews/error');
        else {
            replaceRoleIDWithRoleNameAndUserEmailWithUserName(array, ((err, result) => {
                activeProcessController.convertDate(result);
                for (let i = 0; i < result.length; i++) {
                    result[i].processDate = moment(result[i].processDate).format("DD/MM/YYYY HH:mm:ss");
                }
                result.map((activeProcess) => {
                    activeProcess.currentStages.map((currentStage) => {
                        activeProcess.currentStages[currentStage] = activeProcess.stages[currentStage];
                    });
                });
                res.render('activeProcessesViews/myActiveProcessesPage', {activeProcesses: result});
            }));
        }
    });
});

/////Tomer's Work
router.get('/getAllProcessesReportsByUser', function (req, res) {
    let userName = req.user.emails[0].value;
    processReportController.getAllProcessesReportsByUser(userName, (err, array) => {
        if (err) res.render('errorViews/error');
        if (array === undefined) {
            res.render('reportsViews/processReportPage', {processReports: []});
        }
        else {
            processReportController.convertDate(array);
            res.render('reportsViews/processReportPage', {processReports: array});
        }
    });
});

/////////////////
router.get('/getWaitingActiveProcessesByUser', function (req, res) {
    let userName = req.user.emails[0].value;
    activeProcessController.getWaitingActiveProcessesByUser(userName, (err, array) => {
        if (err) res.render('errorViews/error');
        else {
            replaceRoleIDWithRoleNameAndUserEmailWithUserName(array, ((err, result) => {
                activeProcessController.convertDate(result);
                result.map((activeProcess) => {
                    activeProcess.currentStages.map((currentStage) => {
                        activeProcess.currentStages[currentStage] = activeProcess.stages[currentStage];
                    });
                });
                res.render('activeProcessesViews/myWaitingProcessesPage', {
                    waitingProcesses: result,
                    username: userName
                });
            }));
        }
    });
});

router.get('/getAvailableActiveProcessesByUser', function (req, res) {
    let userName = req.user.emails[0].value;
    activeProcessController.getAvailableActiveProcessesByUser(userName, (err, array) => {
        if (err) res.render('errorViews/error');
        else {
            res.render('activeProcessesViews/myAvailableProcessesPage', {
                availableProcesses: array,
                username: userName
            });
        }
    });
});

router.get('/handleProcessView', function (req, res) {
    let userName = req.user.emails[0].value;
    let processName = req.query.process_name;
    activeProcessController.getNextStagesRolesAndOnlineForms(processName, userName, (err, rolesArr) => {
        if (err) {
            res.render('errorViews/error');
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
        if (err) res.render('errorViews/error');
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
