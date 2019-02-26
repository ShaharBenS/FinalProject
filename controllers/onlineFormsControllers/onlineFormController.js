let onlineForm = require('../../domainObjects/onlineForm');
let onlineFormAccessor = require('../../models/accessors/onlineFormsAccessor');
let fs = require('fs');


module.exports.createOnlineFrom = (formName, srcHTML, callback) => {
    const path = '../../views/onlineFormViews/' + srcHTML + '.html';
    try {
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                callback(err)
            }
            //file exists
            let newOnlineForm = new onlineForm(formName, srcHTML);
            onlineFormAccessor.createOnlineForm(this.getSchemaRecordFromOnlineForm(newOnlineForm), callback);
        });
    } catch (e) {
        callback(e);
    }
};

module.exports.getAllOnlineForms = (callback) => {
    onlineFormAccessor.findAllOnlineForms(callback);
};

module.exports.getOnlineFormByName = (formName, callback) => {
    onlineFormAccessor.findOnlineFormByName(formName, callback);
};

module.exports.getOnlineFormFromSchemaRecord = (form) => {
    return new onlineForm(form.formName, form.HTMLSource)
};

module.exports.getSchemaRecordFromOnlineForm = (form) => {
    return {formName: form.formName, HTMLSource: form.HTMLSource}
};


