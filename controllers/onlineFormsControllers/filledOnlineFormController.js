let FilledOnlineForm = require('../../domainObjects/filledOnlineForm');
let filledOnlineFormAccessor = require('../../models/accessors/filledOnlineFormsAccessor');

module.exports.createFilledOnlineFrom = (formName, fields, callback) => {
    let newFilledOnlineForm = new FilledOnlineForm(formName, fields);
    filledOnlineFormAccessor.createFilledOnlineForm(filledOnlineFormAccessor.getSchemaRecordFromFilledOnlineForm(newFilledOnlineForm), callback)
};

module.exports.getFilledOnlineFormByID = (formID, callback) => {
    filledOnlineFormAccessor.findFilledOnlineFormByFormID(formID, callback);
};
