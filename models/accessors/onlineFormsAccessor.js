let onlineFormSchema = require('../schemas/onlineFormsSchemas/OnlineFormSchema');
let OnlineForm = require('../../domainObjects/onlineForm');

module.exports.createOnlineForm = (newOnlineForm, callback) => {
    this.findOnlineFormByName(newOnlineForm.formName, (err, form) => {
        if (err || form === null)
            onlineFormSchema.create(newOnlineForm, callback);
        else callback(new Error("form already exists in db"));
    });
};

module.exports.findOnlineFormByName = (formName, callback) => {
    onlineFormSchema.findOne({formName: formName}, (err, res) => {
        if (err)
            callback(err);
        else callback(null, this.getOnlineFormFromSchemaRecord(res));
    });
};

module.exports.findOnlineFormByID = (formID, callback) => {
    onlineFormSchema.findOne({_id: formID}, (err, res) => {
        if (err)
            callback(err);
        else callback(null, this.getOnlineFormFromSchemaRecord(res));
    });
};

module.exports.findAllOnlineForms = (callback) => {
    onlineFormSchema.find({}, (err, onlineFormsArray) => {
        if (err) callback(err);
        else {
            let onlineFormsObjects = [];
            onlineFormsArray.forEach((form) => {
                onlineFormsObjects.push(this.getOnlineFormFromSchemaRecord(form));
            });
            callback(null, onlineFormsObjects)
        }
    });
};


module.exports.getOnlineFormFromSchemaRecord = (form) => {
    return new OnlineForm(form.formName, form.HTMLSource, form._id)
};

module.exports.getSchemaRecordFromOnlineForm = (form) => {
    return {formName: form.formName, HTMLSource: form.HTMLSource}
};


