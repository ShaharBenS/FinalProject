let onlineFormSchema = require('../schemas/onlineFormsSchemas/OnlineFormSchema');
let onlineFormController = require('../../controllers/onlineFormsControllers/onlineFormController');

module.exports.createOnlineForm = (newOnlineForm, callback) => {
    onlineFormSchema.create(newOnlineForm, callback);
};

module.exports.findOnlineFormByName = (formName, callback) => {
    onlineFormSchema.findOne({formName: formName}, (err, res) => {
        if (err)
            callback(err);
        else callback(null, onlineFormController.getOnlineFormFromSchemaRecord(res));
    });
};

module.exports.findAllOnlineForms = (callback) => {
    onlineFormSchema.find({}, (err, onlineFormsArray) => {
        if (err) callback(err);
        else {
            let onlineFormsObjects = [];
            onlineFormsArray.forEach((form) => {
                onlineFormsObjects.push(onlineFormController.getOnlineFormFromSchemaRecord(form));
            });
            callback(null, onlineFormsObjects)
        }
    });
};