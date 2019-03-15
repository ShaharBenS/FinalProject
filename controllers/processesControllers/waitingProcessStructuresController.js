let waitingProcessStructuresAccessor = require('../../models/accessors/waitingProcessStructuresAccessor');
let activeProcessController = require('./activeProcessController');

module.exports.getAllWaitingProcessStructuresWithoutSankey = (callback) =>
{
    waitingProcessStructuresAccessor.findProcessStructures({}, (err, waitingProcessStructures) =>
    {
        if (err) {
            callback(err);
        }
        let dates = waitingProcessStructures.map(waitingProcessStructure => waitingProcessStructure.date);
        activeProcessController.convertDate(dates,true);
        let waitingProcessStructuresWithFixedDates = waitingProcessStructures.map((waitingProcessStructure,index) =>
        {
            return {
                id: waitingProcessStructure._id,
                userEmail: waitingProcessStructure.userEmail,
                structureName: waitingProcessStructure.structureName,
                addOrEdit: waitingProcessStructure.addOrEdit,
                date: dates[index],
            };
        });
        callback(null, waitingProcessStructuresWithFixedDates);
    })
};