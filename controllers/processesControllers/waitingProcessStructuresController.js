let waitingProcessStructuresAccessor = require('../../models/accessors/waitingProcessStructuresAccessor');
let activeProcessController = require('./activeProcessController');
let processStructureController = require('../processesControllers/processStructureController');
let onlineFormsController = require('../onlineFormsControllers/onlineFormController');
let usersPermissionsController = require('../usersControllers/UsersPermissionsController');
let notificationController = require('../notificationsControllers/notificationController');
let Notification = require('../../domainObjects/notification');

module.exports.getAllWaitingProcessStructuresWithoutSankey = (callback) => {
    waitingProcessStructuresAccessor.findWaitingProcessStructures({}, (err, waitingProcessStructures) => {
        if (err) {
            callback(err);
        }
        let dates = waitingProcessStructures.map(waitingProcessStructure => waitingProcessStructure.date);
        activeProcessController.convertDate(dates, true);
        let waitingProcessStructuresWithFixedDates = waitingProcessStructures.map((waitingProcessStructure, index) => {
            return {
                id: waitingProcessStructure._id,
                userEmail: waitingProcessStructure.userEmail,
                structureName: waitingProcessStructure.structureName,
                addOrEdit: waitingProcessStructure.addOrEdit,
                deleteRequest: waitingProcessStructure.deleteRequest,
                date: dates[index],
                onlineForms: waitingProcessStructure.onlineForms,
                automaticAdvanceTime: waitingProcessStructure.automaticAdvanceTime,
                notificationTime: waitingProcessStructure.notificationTime,
            };
        });
        callback(null, waitingProcessStructuresWithFixedDates);
    })
};

module.exports.getWaitingStructureById = (_id, callback) => {
    waitingProcessStructuresAccessor.findWaitingProcessStructures({_id: _id}, (err, results) => {
        if (err) {
            callback(err);
        } else if (results.length === 0) {
            callback("Error: no such structure found");
        } else {
            callback(null, results[0]);
        }
    })
};

module.exports.approveProcessStructure = (userEmail, _id, callback) => {
    usersPermissionsController.getUserPermissions(userEmail, (err, permission) => {
        if (err) {
            callback(err);
        } else {
            if (permission.structureManagementPermission) {
                this.getWaitingStructureById(_id, (err, waitingStructure) => {
                    if (err) {
                        callback(err);
                    } else {
                        let commonCallback = (err) => {
                            if (err) {
                                callback(err);
                            }
                            waitingProcessStructuresAccessor.removeWaitingProcessStructures({_id: waitingStructure._id}, (err) => {
                                if (err) {
                                    callback(err);
                                } else {
                                    notificationController.addNotificationToUser(waitingStructure.userEmail, new Notification("מבנה התהליך " + waitingStructure.structureName + " אושר בהצלחה", "מבנה תהליך אושר"), callback)
                                }
                            })
                        };

                        if (waitingStructure.deleteRequest) {
                            processStructureController.removeProcessStructure(userEmail, waitingStructure.structureName, commonCallback);
                        } else {
                            if (waitingStructure.addOrEdit) {
                                processStructureController.addProcessStructure(userEmail, waitingStructure.structureName,
                                    waitingStructure.sankey, waitingStructure.onlineForms, waitingStructure.automaticAdvanceTime, commonCallback);
                            } else {
                                processStructureController.editProcessStructure(userEmail, waitingStructure.structureName,
                                    waitingStructure.sankey, waitingStructure.onlineForms, waitingStructure.automaticAdvanceTime, commonCallback);
                            }
                        }
                    }
                })
            } else {
                callback("ERROR: You don't have the required permissions to perform this operation")
            }
        }
    });
};

module.exports.disapproveProcessStructure = (userEmail, _id, callback) => {
    usersPermissionsController.getUserPermissions(userEmail, (err, permission) => {
        if (err) {
            callback(err);
        } else {
            if (permission.structureManagementPermission) {
                waitingProcessStructuresAccessor.findWaitingProcessStructures({_id: _id}, (err, waitingStructures) => {
                    if (err) {
                        callback(err);
                    } else if (waitingStructures.length === 0) {
                        callback(new Error('No such process found'));
                    } else {
                        waitingProcessStructuresAccessor.removeWaitingProcessStructures({_id: _id}, (err) => {
                            if (err) {
                                callback(err);
                            } else {
                                notificationController.addNotificationToUser(waitingStructures[0].userEmail, new Notification("מבנה התהליך " + waitingStructures[0].structureName + " אושר בהצלחה", "מבנה תהליך לא אושר"),()=>{
                                    if(err){
                                        callback(err);
                                    }
                                    else{
                                        callback(null);
                                    }
                                })
                            }
                        });
                    }
                });
            } else {
                callback("ERROR: You don't have the required permissions to perform this operation")
            }
        }
    });
};

module.exports.updateStructure = (userEmail, id, sankey, onlineFormsIDs, automaticAdvanceTime, notificationTime, callback) => {
    usersPermissionsController.getUserPermissions(userEmail, (err, permissions) => {
        if (err) {
           callback(err);
        }
        else{
            if(permissions.structureManagementPermission){
                waitingProcessStructuresAccessor.updateWaitingProcessStructures({_id: id}, {
                    $set: {
                        sankey: sankey,
                        onlineForms: onlineFormsIDs,
                        automaticAdvanceTime: parseInt(automaticAdvanceTime),
                        notificationTime: parseInt(notificationTime),
                    }
                }, (err)=>{
                    if(err){
                        callback(err);
                    }
                    else{
                        callback(null,'success');
                    }
                });
            }
            else{
                callback(null,"אין לך הרשאות")
            }
        }
    });

};