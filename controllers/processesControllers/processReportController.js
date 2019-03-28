let processAccessor = require('../../models/accessors/processReportAccessor');
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
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) => {
                if (err) callback(err);
                else {
                    let newStage = {
                        roleID: roleID, userEmail: userEmail, stageNum: stageDetails.stageNum, approvalTime: approvalTime,
                        comments: stageDetails.comments, action: stageDetails.action, filledOnlineForms: stageDetails.filledForms,
                        attachedFilesNames: stageDetails.fileNames
                    };
                    let stages = [];
                    processReport.stages.forEach((stage) => {
                        stages.push({
                            roleID: stage.roleID,
                            userEmail: stage.userEmail,
                            stageNum: stage.stageNum,
                            approvalTime: stage.approvalTime,
                            comments: stage.comments,
                            action: stage.action,
                            filledOnlineForms: stage.filledOnlineForms,
                            attachedFilesNames: stage.attachedFilesNames
                        });
                    });
                    stages.push(newStage);
                    processAccessor.updateProcessReport({processName: processName}, {stages: stages}, (err) => {
                        if (err) callback(err);
                        else callback(null);
                    });
                }
            });
        }
    });
}
module.exports.addProcessReport = addProcessReport;
module.exports.addActiveProcessDetailsToReport = addActiveProcessDetailsToReport;