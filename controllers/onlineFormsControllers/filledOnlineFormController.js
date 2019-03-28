let FilledOnlineForm = require('../../domainObjects/filledOnlineForm');
let filledOnlineFormAccessor = require('../../models/accessors/filledOnlineFormsAccessor');
let onlineFormsController = require('./onlineFormController');

module.exports.createFilledOnlineFrom = (formName, fields, callback) => {
    let newFilledOnlineForm = new FilledOnlineForm(formName, fields);
    filledOnlineFormAccessor.createFilledOnlineForm(filledOnlineFormAccessor.getSchemaRecordFromFilledOnlineForm(newFilledOnlineForm), callback)
};

module.exports.getFilledOnlineFormByID = (formID, callback) => {
    filledOnlineFormAccessor.findFilledOnlineFormByFormID(formID, callback);
};


module.exports.getFilledOnlineFormsOfArray = (formIDs, callback) => {
    let forms = [];
    if(formIDs !== undefined && formIDs.length > 0)
    {
        for (let i = 0; i < formIDs.length; i++) {
            this.getFilledOnlineFormByID(formIDs[i], (err, filledForm) => {
                if (err) callback(err);
                else {
                    forms.push(filledForm);
                    if (forms.length === formIDs.length) {
                        callback(null, forms);
                    }
                }
            });
        }
    }
    else
    {
        callback(null,[]);
    }
};

module.exports.displayFilledForm = function (filledFormID, callback) {
    this.getFilledOnlineFormByID(filledFormID, (err, form) => {
        if (err) callback(err);
        else {
            form = form.formObject;
            onlineFormsController.getOnlineFormByName(form.formName, (err, onlineForm) => {
                if (err) callback(err);
                else {
                    let fields = [];
                    form.fields.forEach((field) => {
                        fields.push({fieldName: field.fieldName, value: field.value})
                    });
                    let fieldsStr = JSON.stringify(fields);
                    let locals = {formName: form.formName, isForShow: false, fields: fieldsStr};
                    callback(null, locals, onlineForm.HTMLSource);
                }
            })
        }
    });
};
