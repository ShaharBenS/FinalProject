let processAccessor = require('../../models/accessors/processReportAccessor');
let processReportAccessor = require('../../models/accessors/processReportAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let moment = require('moment');

function addProcessReport(processName, creationTime,processDate,processUrgency,processCreatorEmail,callback){
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
}

function addActiveProcessDetailsToReport(processName, userEmail,stageDetails, approvalTime, callback){
    processAccessor.findProcessReport({processName: processName}, (err) => {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                if (err) callback(err);
                else {
                    let newStage = {
                        roleID: roleID, userEmail: userEmail, stageNum: stageDetails.stageNum, approvalTime: approvalTime,
                        comments: stageDetails.comments, action: stageDetails.action,
                        attachedFilesNames: stageDetails.fileNames
                    };
                    processAccessor.updateProcessReport({processName: processName}, {$push:{stages: newStage}}, (err) => {
                        if (err) callback(err);
                        else callback(null);
                    });
                }
            });
        }
    });
}

module.exports.getAllProcessesReportsByUser = (userEmail, callback) => {
    usersAndRolesController.getRoleIdByUsername(userEmail, (err) => {
        if (err) {
            callback(err);
        } else {
            processReportAccessor.findProcessesReports({}, (err, processReports) => {
                if (err) callback(err);
                else {
                    usersAndRolesController.getAllChildren(userEmail,(err,children)=>{
                        if(err) {
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
                                if (isExistInReport(process,userEmail))
                                {
                                    flag = false;
                                    toReturnProcessReports.push(process);
                                    currUserEmails = [userEmail];
                                }
                                children.forEach((child)=>{
                                    if (isExistInReport(process,child))
                                    {
                                        if(flag === false)
                                        {
                                            currUserEmails = currUserEmails.concat(child);
                                        }
                                        else
                                        {
                                            toReturnProcessReports.push(process);
                                            currUserEmails = [child];
                                            flag = false;
                                        }
                                    }
                                });
                                if(flag === false)
                                {
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

function isExistInReport(report,userEmail)
{
    for(let i=0;i<report._doc.stages.length;i++)
    {
        if(report._doc.stages[i].userEmail === userEmail)
        {
            return true;
        }
    }
    return report.processCreatorEmail === userEmail;
}


function convertDate(array) {
    for (let i = 0; i < array.length; i++) {
        array[i]._doc.processDate =  moment(array[i]._doc.processDate).format("DD/MM/YYYY HH:mm:ss");
    }
}

module.exports.convertDate = convertDate;
module.exports.addProcessReport = addProcessReport;
module.exports.addActiveProcessDetailsToReport = addActiveProcessDetailsToReport;