let OnlineForm = require('../../domainObjects/onlineForm');
let onlineFormAccessor = require('../../models/accessors/onlineFormsAccessor');
let fs = require('fs');


let whileReplace = function (str, replace, by) {
    while (str.indexOf(replace) >= 0)
        str = str.replace(replace, by);
    return str;
};

module.exports.createAllOnlineForms = () => {
    let files = fs.readdirSync(__dirname + "\\..\\..\\views\\onlineFormViews\\");
    for (let i in files) {
        let fileName = files[i];
        if (fileName !== 'example.html') {
            let fileNameNoHTML = fileName.replace('.html', '');
            let formName = whileReplace(fileNameNoHTML, '_', ' ');
            this.createOnlineFrom(formName, fileNameNoHTML, (err) => {
            });
        }
    }

    this.createOnlineFrom("טופס קניות", "טופס_קניות", (err) => {
    });
    this.createOnlineFrom("טופס דרישה", "טופס_דרישה_פנימית", (err) => {
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

module.exports.findOnlineFormsIDsByFormsNames = (formsNames, callback) => {
    onlineFormAccessor.findOnlineFormsIDsByFormsNames(formsNames, callback);
};

module.exports.findOnlineFormsNamesByFormsIDs = (formsIDs, callback) => {
    onlineFormAccessor.findOnlineFormsNamesByFormsIDs(formsIDs, callback);
};

module.exports.getOnlineFormByName = (formName, callback) => {
    onlineFormAccessor.findOnlineFormByName(formName, callback);
};
