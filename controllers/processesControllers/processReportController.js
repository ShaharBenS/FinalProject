let processAccessor = require('../../models/accessors/processReportAccessor');
let processReportAccessor = require('../../models/accessors/processReportAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let moment = require('moment');

module.exports.addProcessReport = (processName, creationTime, processDate, processUrgency, processCreatorEmail, callback) => {
    processAccessor.createProcessReport({
        processName: processName,
        status: 'פעיל',
        processDate: processDate,
        processUrgency: processUrgency,
        processCreatorEmail: processCreatorEmail,
        creationTime: creationTime,
        stages: [],
        filledOnlineForms: []
    }, (err) => {
        if (err) callback(err);
        else callback(null);
    });
};

module.exports.addActiveProcessDetailsToReport = (processName, userEmail, stageDetails, approvalTime, callback) => {
    processAccessor.findProcessReport({processName: processName}, (err, report) => {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleNameByUsername(userEmail, (err, roleName) => {
                if (err) callback(err);
                else {
                    usersAndRolesController.getFullNameByEmail(userEmail, (err2, userName) => {
                        if (err2) {
                            callback(err2);
                        }
                        else {
                            let newStage = {
                                roleName: roleName,
                                userEmail: userEmail,
                                userName: userName,
                                stageNum: stageDetails.stageNum,
                                approvalTime: approvalTime,
                                comments: stageDetails.comments,
                                action: stageDetails.action,
                                attachedFilesNames: stageDetails.fileNames
                            };
                            let newAttachedFiles = [];
                            for (let i = 0; i < stageDetails.fileNames.length; i++) {
                                if (!report.attachedFilesNames.includes(stageDetails.fileNames[i])) {
                                    newAttachedFiles.push(stageDetails.fileNames[i]);
                                }
                            }
                            processAccessor.updateProcessReport({processName: processName}, {
                                $push: {
                                    stages: newStage,
                                    attachedFilesNames: {$each: newAttachedFiles}
                                }
                            }, (err) => {
                                if (err) callback(err);
                                else callback(null);
                            });
                        }
                    });
                }
            });
        }
    });
};

module.exports.getAllProcessesReportsByUser = (userEmail, callback) => {
    usersAndRolesController.getRoleIdByUsername(userEmail, (err) => {
        if (err) {
            callback(err);
        } else {
            processReportAccessor.findProcessesReports({}, (err, processReports) => {
                if (err) callback(err);
                else {
                    usersAndRolesController.getAllChildren(userEmail, (err, children) => {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if (processReports === null)
                            processReports = [];
                        let toReturnProcessReports = [];
                        let userEmailsArrays = [];
                        if (processReports !== null) {
                            processReports.forEach((process) => {
                                let flag = true;
                                let currUserEmails = [];
                                if (isExistInReport(process, userEmail)) {
                                    flag = false;
                                    toReturnProcessReports.push(process);
                                    currUserEmails = [userEmail];
                                }
                                children.forEach((child) => {
                                    if (isExistInReport(process, child)) {
                                        if (flag === false) {
                                            currUserEmails = currUserEmails.concat(child);
                                        }
                                        else {
                                            toReturnProcessReports.push(process);
                                            currUserEmails = [child];
                                            flag = false;
                                        }
                                    }
                                });
                                if (flag === false) {
                                    userEmailsArrays.push(currUserEmails);
                                }
                            });
                            callback(null, toReturnProcessReports);
                        } else {
                            callback(null, toReturnProcessReports);
                        }
                    });
                }
            });
        }
    });
};

module.exports.processReport = function (process_name, callback) {
    this.getAllActiveProcessDetails(process_name, (err, result) => {
        if (err) callback(err);
        else {
            result[0].creationTime = moment(result[0].creationTime).format("DD/MM/YYYY HH:mm:ss");
            result[0].processDate = moment(result[0].processDate).format("DD/MM/YYYY HH:mm:ss");
            for (let i = 0; i < result[1].length; i++) {
                result[1][i].approvalTime = moment(result[1][i].approvalTime).format("DD/MM/YYYY HH:mm:ss");
            }
            activeProcessController.getFilledOnlineForms(result[0].filledOnlineForms, 0, [], (err, formsArr) => {
                for (let i = 0; i < formsArr.length; i++) {
                    result[0].filledOnlineForms[i] = formsArr[i];
                }
                callback(null, result);
            });
        }
    });
};

module.exports.getAllActiveProcessDetails = (processName, callback) => {
    processReportAccessor.findProcessReport({processName: processName}, (err, processReport) => {
        if (err) callback(err);
        else {
            processReport = processReport._doc;
            let returnProcessDetails = {
                processName: processReport.processName,
                creationTime: processReport.creationTime,
                status: processReport.status,
                urgency: processReport.processUrgency,
                processDate: processReport.processDate,
                filledOnlineForms: processReport.filledOnlineForms
            };
            callback(null, [returnProcessDetails, processReport.stages]);
        }
    });
};

function isExistInReport(report, userEmail) {
    for (let i = 0; i < report._doc.stages.length; i++) {
        if (report._doc.stages[i].userEmail === userEmail) {
            return true;
        }
    }
    return report.processCreatorEmail === userEmail;
}

module.exports.convertDate = (array) => {
    for (let i = 0; i < array.length; i++) {
        array[i]._doc.processDate = moment(array[i]._doc.processDate).format("DD/MM/YYYY HH:mm:ss");
    }
};

module.exports.isExistInReport = isExistInReport;