let waitingProcessStructuresAccessor = require('../../models/accessors/waitingProcessStructuresAccessor');
let activeProcessController = require('./activeProcessController');
let processStructureController = require('../processesControllers/processStructureController');
let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let usersPermissionsController = require('../usersControllers/UsersPermissionsController');

module.exports.getAllWaitingProcessStructuresWithoutSankey = (callback) =>
{
    waitingProcessStructuresAccessor.findWaitingProcessStructures({}, (err, waitingProcessStructures) =>
    {
        if (err) {
            callback(err);
        }
        let dates = waitingProcessStructures.map(waitingProcessStructure => waitingProcessStructure.date);
        activeProcessController.convertDate(dates, true);
        let waitingProcessStructuresWithFixedDates = waitingProcessStructures.map((waitingProcessStructure, index) =>
        {
            return {
                id: waitingProcessStructure._id,
                userEmail: waitingProcessStructure.userEmail,
                structureName: waitingProcessStructure.structureName,
                addOrEdit: waitingProcessStructure.addOrEdit,
                date: dates[index],
                onlineFormsOfStage: waitingProcessStructure.onlineFormsOfStage,
            };
        });
        callback(null, waitingProcessStructuresWithFixedDates);
    })
};

module.exports.getWaitingStructureById = (_id, callback) =>
{
    waitingProcessStructuresAccessor.findWaitingProcessStructures({_id: _id}, (err, results) =>
    {
        if (err) {
            callback(err);
        }
        else if (results.length === 0) {
            callback("Error: no such structure found");
        }
        else {
            callback(null, results[0]);
        }
    })
};

module.exports.approveProcessStructure = (userEmail, _id, callback) =>
{
    usersPermissionsController.getUserPermissions(userEmail,(err,permission)=>{
      if(err){
          callback(err);
      }
      else{
          if(permission.structureManagementPermission){
              this.getWaitingStructureById(_id,(err,waitingStructure)=>{
                  if(err){
                      callback(err);
                  }
                  else{
                      let commonCallback = (err)=>{
                          if(err){
                              callback(err);
                          }
                          waitingProcessStructuresAccessor.removeWaitingProcessStructures({_id:waitingStructure._id},callback)
                      };

                      if(waitingStructure.addOrEdit){
                          processStructureController.addProcessStructure(userEmail,waitingStructure.structureName,
                              waitingStructure.sankey,JSON.parse(waitingStructure.onlineFormsOfStage),commonCallback)
                      }
                      else{
                          processStructureController.editProcessStructure(userEmail,waitingStructure.structureName,
                              waitingStructure.onlineFormsOfStage,commonCallback);
                      }
                  }
              })
          }
          else{
              callback("ERROR: You don't have the required permissions to perform this operation")
          }
      }
    });
};

module.exports.disapproveProcessStructure = (userEmail, _id,callback)=>{
    usersPermissionsController.getUserPermissions(userEmail,(err,permission)=> {
        if (err) {
            callback(err);
        }
        else{
            if(permission.structureManagementPermission){
                waitingProcessStructuresAccessor.removeWaitingProcessStructures({_id:_id},callback);
            }
            else{
                callback("ERROR: You don't have the required permissions to perform this operation")
            }
        }
    });
};