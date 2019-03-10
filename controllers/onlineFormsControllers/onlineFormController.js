let OnlineForm = require('../../domainObjects/onlineForm');
let onlineFormAccessor = require('../../models/accessors/onlineFormsAccessor');

module.exports.createOnlineFrom = (formName, srcHTML, callback) => {
    try {
        let newOnlineForm = new OnlineForm(formName, srcHTML);
        onlineFormAccessor.createOnlineForm(onlineFormAccessor.getSchemaRecordFromOnlineForm(newOnlineForm), callback);
        //});
    } catch (e) {
        callback(e);
    }
};

module.exports.getAllOnlineForms = (callback) => {
    onlineFormAccessor.findAllOnlineForms(callback);
};

module.exports.getOnlineFormByID = (formID, callback) => {
    onlineFormAccessor.findOnlineFormByID(formID, callback);
};

module.exports.getOnlineFormByName = (formName, callback) => {
    onlineFormAccessor.findOnlineFormByName(formName, callback);
};
