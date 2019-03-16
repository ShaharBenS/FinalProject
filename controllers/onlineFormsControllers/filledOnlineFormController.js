let FilledOnlineForm = require('../../domainObjects/filledOnlineForm');
let filledOnlineFormAccessor = require('../../models/accessors/filledOnlineFormsAccessor');

module.exports.createFilledOnlineFrom = (formName, fields, callback) => {
    let newFilledOnlineForm = new FilledOnlineForm(formName, fields);
    filledOnlineFormAccessor.createFilledOnlineForm(filledOnlineFormAccessor.getSchemaRecordFromFilledOnlineForm(newFilledOnlineForm), callback)
};

module.exports.getFilledOnlineFormByID = (formID, callback) => {
    filledOnlineFormAccessor.findFilledOnlineFormByFormID(formID, callback);
};


module.exports.getFilledOnlineFormsOfArray = (formIDs, callback) => {
    let forms = [];
    for (let i = 0; i < formIDs.length; i++) {
        forms.push(this.getFilledOnlineFormByID(formIDs[i], (err, filledForm) => {
            if (err) callback(err);
            else return filledForm;
        }));
    }
    Promise.all(forms).then(values => {
        callback(null, values)
    });
};