let waitingProcessStructuresAccessor = require('../../models/accessors/waitingProcessStructuresAccessor');
let activeProcessController = require('./activeProcessController');
let processStructureController = require('../processesControllers/processStructureController');
let onlineFormsController = require('../onlineFormsControllers/onlineFormController');
let usersPermissionsController = require('../usersControllers/UsersPermissionsController');
let notificationController = require('../notificationsControllers/notificationController');
let Notification = require('../../domainObjects/notification');
let userAccessor = require('../../models/accessors/usersAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
module.exports.getAllWaitingProcessStructuresWithoutSankey = (callback) => {
    waitingProcessStructuresAccessor.findWaitingProcessStructures({}, (err, waitingProcessStructures) => {
        if (err) {
            callback(err);
        }
        else
        {
            let dates = waitingProcessStructures.map(waitingProcessStructure => waitingProcessStructure.date);
            activeProcessController.convertDate(dates, true);
            userAccessor.findUsername({}, (err2, userNames) => {
                if (err2) {
                    callback(err2);
                }
                else {
                    let userEmailToUserName = {};
                    userNames.forEach(userName => {
                        userEmailToUserName[userName.userEmail] = userName.userName;
                    });
                    waitingProcessStructures.reduce((acc, currentProcess) => {
                        return (err)=>{
                            if(err) {
                                acc(err);
                            }
                            else
                            {
                                usersAndRolesController.getRoleNameByUsername(currentProcess.userEmail,(err, roleName)=>{
                                   if(err) acc(err);
                                   else
                                   {
                                       currentProcess.roleName = roleName;
                                       acc(null);
                                   }
                                });
                            }
                        };
                    },(err)=>{
                        if(err){
                            callback(err);
                        }
                        else{
                            let waitingProcessStructuresWithFixedDates = waitingProcessStructures.map((waitingProcessStructure, index) => {
                                return {
                                    id: waitingProcessStructure._id,
                                    userName: userEmailToUserName[waitingProcessStructure.userEmail],
                                    roleName: waitingProcessStructure.roleName,
                                    structureName: waitingProcessStructure.structureName,
                                    addOrEdit: waitingProcessStructure.addOrEdit,
                                    deleteRequest: waitingProcessStructure.deleteRequest,
                                    date: dates[index],
                                    onlineForms: waitingProcessStructure.onlineForms,
                                    automaticAdvanceTime: waitingProcessStructure.automaticAdvanceTime,
                                    notificationTime: waitingProcessStructure.notificationTime,
                                    userEmail: waitingProcessStructure.userEmail
                                };
                            });
                            callback(null, waitingProcessStructuresWithFixedDates);
                        }
                    })(null);
                }
            });
        }
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
                        let notification = new Notification("הוספת מבנה התהליך " + waitingStructure.structureName + " אושרה בהצלחה.", "מבנה תהליך אושר");
                        let commonCallback = (err) => {
                            if (err) {
                                callback(err);
                            }
                            else {
                                waitingProcessStructuresAccessor.removeWaitingProcessStructures({_id: waitingStructure._id}, (err) => {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        notificationController.addNotificationToUser(waitingStructure.userEmail, notification, callback)
                                    }
                                })
                            }
                        };

                        if (waitingStructure.deleteRequest) {
                            notification = new Notification("מחיקת מבנה התהליך " + waitingStructure.structureName + " אושרה בהצלחה.", "מבנה תהליך אושר");
                            processStructureController.removeProcessStructure(userEmail, waitingStructure.structureName, commonCallback);
                        } else {
                            if (waitingStructure.addOrEdit) {
                                processStructureController.addProcessStructure(userEmail, waitingStructure.structureName,
                                    waitingStructure.sankey, waitingStructure.onlineForms, waitingStructure.automaticAdvanceTime, waitingStructure.notificationTime, commonCallback);
                            } else {
                                notification = new Notification("עריכת מבנה התהליך " + waitingStructure.structureName + " אושרה בהצלחה.", "מבנה תהליך אושר");
                                processStructureController.editProcessStructure(userEmail, waitingStructure.structureName,
                                    waitingStructure.sankey, waitingStructure.onlineForms, waitingStructure.automaticAdvanceTime, waitingStructure.notificationTime, commonCallback);
                            }
                        }
                    }
                })
            } else {
                callback(new Error("ERROR: You don't have the required permissions to perform this operation"));
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
                                let notification = new Notification("הוספת מבנה התהליך " + waitingStructures[0].structureName + " נדחתה", "מבנה תהליך לא אושר");
                                if (waitingStructures[0].deleteRequest) {
                                    notification = new Notification("מחיקת מבנה התהליך " + waitingStructures[0].structureName + " נדחתה", "מבנה תהליך לא אושר");
                                } else {
                                    if (waitingStructures[0].addOrEdit) {

                                    } else {
                                        notification = new Notification("עריכת מבנה התהליך " + waitingStructures[0].structureName + " נדחתה", "מבנה תהליך לא אושר");
                                    }
                                }
                                notificationController.addNotificationToUser(waitingStructures[0].userEmail, notification, () => {
                                    if (err) {
                                        callback(err);
                                    }
                                    else {
                                        callback(null);
                                    }
                                })
                            }
                        });
                    }
                });
            } else {
                callback(new Error("ERROR: You don't have the required permissions to perform this operation"));
            }
        }
    });
};

module.exports.updateStructure = (userEmail, id, sankey, onlineFormsIDs, automaticAdvanceTime, notificationTime, callback) => {
    usersPermissionsController.getUserPermissions(userEmail, (err, permissions) => {
        if (err) {
            callback(err);
        }
        else {
            if (permissions.structureManagementPermission) {
                waitingProcessStructuresAccessor.updateWaitingProcessStructures({_id: id}, {
                    $set: {
                        sankey: sankey,
                        onlineForms: onlineFormsIDs,
                        automaticAdvanceTime: parseInt(automaticAdvanceTime),
                        notificationTime: parseInt(notificationTime),
                    }
                }, (err) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, 'success');
                    }
                });
            }
            else {
                callback(null, "אין לך הרשאות")
            }
        }
    });

};