let FilledOnlineForm = require('../../domainObjects/filledOnlineForm');
let filledOnlineFormAccessor = require('../../models/accessors/filledOnlineFormsAccessor');
let onlineFormsController = require('./onlineFormController');
let activeProcessController = require('../processesControllers/activeProcessController.js');

module.exports.createFilledOnlineFrom = (formName, fields, shouldLock, callback) => {
    onlineFormsController.getOnlineFormByName(formName, (err, form) => {
        if (err) callback(err);
        else if (form === null) callback(new Error("form was not found"));
        else {
            let newFilledOnlineForm = new FilledOnlineForm(formName, fields, shouldLock);
            filledOnlineFormAccessor.createFilledOnlineForm(filledOnlineFormAccessor.getSchemaRecordFromFilledOnlineForm(newFilledOnlineForm), callback);
        }
    })
};

function getFilledOnlineFormByID(formID, callback) {
    filledOnlineFormAccessor.findFilledOnlineFormByFormID(formID, callback);
}

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
                    let locals = {
                        formName: form.formName, isForShow: true, fields: fieldsStr, shouldLock: true
                    };
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
                        fields: false,
                        shouldLock: false
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
                        fields: fieldsStr,
                        shouldLock: form.isLocked
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
            getFilledOnlineForms(activeProcess.filledOnlineForms, 0, [], (err, filledForms) => {
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

module.exports.updateOrAddFilledForm = function (processName, formName, formFields, shouldLock, callback) {
    this.getFormReady(processName, formName, (err, form) => {
        if (err) callback(err);
        else {
            if (form === undefined) {
                this.createFilledOnlineFrom(formName, formFields, shouldLock, (err, dbForm) => {
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
                let isLocked = false;
                if (!form.formObject.isLocked && shouldLock)
                    isLocked = true;
                if (form.formObject.isLocked) {
                    callback(new Error("form error! cant update locked form"));
                } else
                    filledOnlineFormAccessor.updateFilledOnlineForm({_id: formID}, {
                        fields: newField,
                        isLocked: shouldLock
                    }, (err, res) => {
                        if (err) callback(err);
                        else callback(null, res);
                    });
            }
        }
    })
};

function getFilledOnlineForms(filledFormIds, index, filledFormsArray, callback) {
    if (index === filledFormIds.length) {
        callback(null, filledFormsArray);
        return;
    }
    getFilledOnlineFormByID(filledFormIds[index], (err, form) => {
        if (err) callback(err);
        else {
            filledFormsArray.push(form);
            getFilledOnlineForms(filledFormIds, index + 1, filledFormsArray, callback);
        }
    });
}

module.exports.getFilledOnlineForms = getFilledOnlineForms;
module.exports.getFilledOnlineFormByID = getFilledOnlineFormByID;