let onlineFormSchema = require('../schemas/onlineFormsSchemas/OnlineFormSchema');
let onlineFormController = require('../../controllers/onlineFormsControllers/onlineFormController');
let fs = require('fs');

module.exports.createOnlineForm = (newOnlineForm, callback) => {
    const path = '../../views/onlineFormViews/' + newOnlineForm.srcFileName + '.html';
    try {
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                callback(err)
            }
            //file exists
            onlineFormSchema.create(newOnlineForm, callback);
        });
    } catch (e) {
        callback(e);
    }
};

module.exports.findOnlineFormByName = (formName, callback) => {
    onlineFormSchema.findOne({formName: formName}, (err, res) => {
        if (err)
            callback(err);
        else callback(null, res);
    });
};

module.exports.findAllOnlineForms = (callback) => {
    onlineFormSchema.find({}, (err, onlineFormsArray) => {
        if (err) callback(err);
        else {
            let onlineFormsObjects = [];
            onlineFormsArray.forEach((form) => {
                onlineFormsObjects.push(onlineFormController.createOnlineFormFromSchemaRecord(form));
            });
            callback(null, onlineFormsObjects)
        }
    });
};