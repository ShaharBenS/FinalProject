let FilledOnlineForm = require('../../domainObjects/filledOnlineForm');
let filledOnlineFormAccessor = require('../../models/accessors/filledOnlineFormsAccessor');
let onlineFormsController = require('./onlineFormController');
let activeProcessController = require('../processesControllers/activeProcessController.js');

module.exports.createFilledOnlineFrom = (formName, fields, callback) => {
    onlineFormsController.getOnlineFormByName(formName, (err, form) => {
        if (err) callback(err);
        else if (form === null) callback(new Error("form was not found"));
        else {
            let newFilledOnlineForm = new FilledOnlineForm(formName, fields);
            filledOnlineFormAccessor.createFilledOnlineForm(filledOnlineFormAccessor.getSchemaRecordFromFilledOnlineForm(newFilledOnlineForm), callback);
        }
    })
};

module.exports.getFilledOnlineFormByID = (formID, callback) => {
    filledOnlineFormAccessor.findFilledOnlineFormByFormID(formID, callback);
};

module.exports.displayFilledForm = function (filledFormID, callback) {
    this.getFilledOnlineFormByID(filledFormID, (err, form) => {
        if (err) callback(err);
        else {
            form = form.formObject;
            onlineFormsController.getOnlineFormByName(form.formName, (err, onlineForm) => {
                if (err) callback(err);
                else if (onlineForm === null) callback(new Error("online form was not found"));
                else {
                    let fields = [];
                    form.fields.forEach((field) => {
                        fields.push({fieldName: field.fieldName, value: field.value})
                    });
                    let fieldsStr = JSON.stringify(fields);
                    let locals = {formName: form.formName, isForShow: true, fields: fieldsStr};
                    callback(null, locals, onlineForm.HTMLSource);
                }
            })
        }
    });
};

module.exports.getFormReadyToFill = function (processName, formName, callback) {
    this.getFormReady(processName, formName, (err, form) => {
        if (err) callback(err);
        else if (form === undefined) {
            onlineFormsController.getOnlineFormByName(formName, (err, form) => {
                if (err) callback(err);
                else if (form === null) callback(new Error("form was not found"));
                else {
                    let locals = {
                        formName: form.formName,
                        isForShow: false,
                        fields: false
                    };
                    callback(null, form.HTMLSource, locals);
                }
            });
        } else {
            form = form.formObject;
            let fields = [];
            form.fields.forEach((field) => {
                fields.push({fieldName: field.fieldName, value: field.value})
            });
            let fieldsStr = JSON.stringify(fields);
            onlineFormsController.getOnlineFormByName(formName, (err, form) => {
                if (err) callback(err);
                else {
                    let locals = {
                        formName: form.formName,
                        isForShow: false,
                        fields: fieldsStr
                    };
                    callback(null, form.HTMLSource, locals);
                }
            });
        }
    });
};

module.exports.getFormReady = function (processName, formName, callback) {
    activeProcessController.getActiveProcessByProcessName(processName, (err, activeProcess) => {
        if (err) callback(err);
        else if (activeProcess === null) callback(new Error("process was not found"));
        else {
            activeProcessController.getFilledOnlineForms(activeProcess.filledOnlineForms, 0, [], (err, filledForms) => {
                if (err) callback(err);
                else {
                    let myForm = undefined;
                    filledForms.forEach((form) => {
                        if (form.formObject.formName === formName) {
                            myForm = form;
                        }
                    });
                    callback(null, myForm);
                }
            });
        }
    });
};

module.exports.updateOrAddFilledForm = function (processName, formName, formFields, callback) {
    this.getFormReady(processName, formName, (err, form) => {
        if (err) callback(err);
        else {
            if (form === undefined) {
                this.createFilledOnlineFrom(formName, formFields, (err, dbForm) => {
                    if (err) callback(err);
                    else {
                        activeProcessController.addFilledOnlineFormToProcess(processName, dbForm._id, callback);
                    }
                });
            } else {
                let formID = form.formID;
                let newField = [];
                formFields.forEach(field => {
                    newField.push({fieldName: field.field, value: field.value});
                });
                filledOnlineFormAccessor.updateFilledOnlineForm({_id: formID}, {fields: newField}, (err, res) => {
                    if (err) callback(err);
                    else callback(null, res);
                });
            }
        }
    })
};