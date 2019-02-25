let onlineForm = require('../../domainObjects/onlineForm');
let onlineFormAccessor = require('../../models/accessors/onlineFormsAccessor');

module.exports.getAllOnlineForms = (callback) => {
    onlineFormAccessor.findAllOnlineForms(callback);
};

module.exports.getOnlineFormByName = (formName, callback) => {
    onlineFormAccessor.findOnlineFormByName(formName, callback);
};

module.exports.createOnlineFormFromSchemaRecord = (form) => {
    return new onlineForm(form.formName, form.HTMLSource)
};

module.exports.createSchemaRecordFromOnlineForm = (form) => {
    return {formName: form.formName, HTMLSource: form.HTMLSource}
};


