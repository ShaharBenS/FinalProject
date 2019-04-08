
let OnlineForm = require('../../domainObjects/onlineForm');
let onlineFormAccessor = require('../../models/accessors/onlineFormsAccessor');

module.exports.createAllOnlineForms = () => {
    this.createOnlineFrom("טופס החתמה על ציוד", "טופס_החתמה_על_ציוד", (err) => {
    });
    this.createOnlineFrom("טופס קניות", "טופס_קניות", (err) => {
    });
};

module.exports.createOnlineFrom = (formName, srcHTML, callback) => {
    try {
        let newOnlineForm = new OnlineForm(formName, srcHTML);
        onlineFormAccessor.createOnlineForm(onlineFormAccessor.getSchemaRecordFromOnlineForm(newOnlineForm), callback);
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

module.exports.findOnlineFormsIDsByFormsNames = (formsNames, callback) =>{
    onlineFormAccessor.findOnlineFormsIDsByFormsNames(formsNames, callback);
};

module.exports.findOnlineFormsNamesByFormsIDs = (formsIDs, callback) =>{
    onlineFormAccessor.findOnlineFormsNamesByFormsIDs(formsIDs, callback);
};

module.exports.getOnlineFormByName = (formName, callback) => {
    onlineFormAccessor.findOnlineFormByName(formName, callback);
};
