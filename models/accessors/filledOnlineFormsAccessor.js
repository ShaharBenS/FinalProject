let filledOnlineFormSchema = require('../schemas/onlineFormsSchemas/FilledOnlineFormSchema');
let FilledOnlineForm = require('../../domainObjects/filledOnlineForm');

module.exports.createFilledOnlineForm = (newFilledOnlineForm, callback) => {
    filledOnlineFormSchema.create(newFilledOnlineForm, callback);
};

module.exports.findFilledOnlineFormByFormID = (formID, callback) => {
    filledOnlineFormSchema.findOne({_id: formID}, (err, res) => {
        if (err)
            callback(err);
        else if (res === null) callback(new Error("form does not found"));
        else callback(null, {formID: formID, formObject: this.getFilledOnlineFormFromSchemaRecord(res)});
    });
};

module.exports.getFilledOnlineFormFromSchemaRecord = (form) => {
    return new FilledOnlineForm(form.formName, form.fields)
};

module.exports.getSchemaRecordFromFilledOnlineForm = (form) => {
    let fields = [];
    form.fields.forEach((answerMap) => fields.push({fieldName: answerMap.field, value: answerMap.value}));
    return {formName: form.formName, fields: fields}
};

