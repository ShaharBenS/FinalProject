let processAccessor = require('../../models/accessors/processReportAccessor');
let processReportAccescor = require('../../models/accessors/processReportAccessor');

let usersAndRolesController = require('../usersControllers/usersAndRolesController');


function addProcessReport(processName, creationTime,processDate,processUrgency,callback){
    processAccessor.createProcessReport({
        processName: processName,
        status: 'activated',
        processDate: processDate,
        processUrgency: processUrgency,
        creationTime: creationTime,
        stages: []
    }, (err) => {
        if (err) callback(err);
        else callback(null);
    });
}

function addActiveProcessDetailsToReport(processName,userEmail, stageDetails, approvalTime, callback){
    processAccessor.findProcessReport({processName: processName}, (err, processReport) => {
        if (err) callback(err);
        else {
            usersAndRolesController.getUserIDByEmail(userEmail,(err,userID)=>{
                if (err) callback(err);
                else
                {
                    usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                        if (err) callback(err);
                        else {
                            let newStage = {
                                role: roleID, user: userID, stageNum: stageDetails.stageNum, approvalTime: approvalTime,
                                comments: stageDetails.comments, action: stageDetails.action, filledOnlineForms: stageDetails.filledForms,
                                attachedFilesNames: stageDetails.fileNames
                            };
                            processReport.stages.push(newStage);
                            processAccessor.updateProcessReport({processName: processName}, {stages: processReport.stages}, (err) => {
                                if (err) callback(err);
                                else callback(null);
                            });
                        }
                    });
                }
            });
        }
    });
}


//////////////////////////////////
module.exports.getAllProcessesReportsByUser = (userEmail, callback) => {
    usersAndRolesController.getRoleIdByUsername(userEmail, (err) => {
        if (err) {
            callback(err);
        } else {
            processReportAccescor.findProcessesReports({}, (err, processReports) => {
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
                                let x = process;
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
//////////////////////////////////
function isExistInReport(report,userEmail)
{
    for(let i=0;i<report.stages.length;i++)
    {
        if(report.stages[i].user.userEmail === userEmail)
        {
            return true;
        }
    }
    return false;
}


function convertDate(array) {
    for (let i = 0; i < array.length; i++) {
        let processDate = array[i].processDate;
        let dayOfProcessDate = processDate.getDate();
        let monthOfProcessDate = processDate.getMonth() + 1;
        let yearOfProcessDate = processDate.getFullYear();
        if (dayOfProcessDate < 10) {
            dayOfProcessDate = '0' + dayOfProcessDate;
        }
        if (monthOfProcessDate < 10) {
            monthOfProcessDate = '0' + monthOfProcessDate;
        }
        let dateOfProcessDate = dayOfProcessDate + '/' + monthOfProcessDate + '/' + yearOfProcessDate;
        let hourOfProcessDate = processDate.getHours();
        let minuteOfProcessDate  = processDate.getMinutes();
        let secondsOfProcessDate  = processDate.getSeconds();
        if (hourOfProcessDate.toString().length === 1)
            hourOfProcessDate = '0' + hourOfProcessDate;
        if (minuteOfProcessDate.toString().length === 1)
            minuteOfProcessDate = '0' + minuteOfProcessDate;
        if (secondsOfProcessDate.toString().length === 1)
            secondsOfProcessDate = '0' + secondsOfProcessDate;
        dateOfProcessDate = dateOfProcessDate + ' ' + hourOfProcessDate + ':' + minuteOfProcessDate + ':' + secondsOfProcessDate;
        array[i].processDate = dateOfProcessDate;
    }
}

module.exports.convertDate = convertDate;
module.exports.addProcessReport = addProcessReport;
module.exports.addActiveProcessDetailsToReport = addActiveProcessDetailsToReport;