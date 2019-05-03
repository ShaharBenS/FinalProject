let OnlineForm = require('../../domainObjects/onlineForm');
let onlineFormAccessor = require('../../models/accessors/onlineFormsAccessor');
let fs = require('fs');


let whileReplace = function (str, replace, by) {
    while (str.indexOf(replace) >= 0)
        str = str.replace(replace, by);
    return str;
};

module.exports.createAllOnlineForms = (callback) => {
    let files = fs.readdirSync(__dirname + "\\..\\..\\views\\onlineFormViews\\");
    let length = files.length;
    let success = 0;
    let remove = 0;
    for (let i in files) {
        let fileName = files[i];
        if (fileName !== 'form_template.html' && fileName.substring(fileName.length - 5) === '.html') {
            let fileNameNoHTML = fileName.replace('.html', '');
            let formName = whileReplace(fileNameNoHTML, '_', ' ');
            this.createOnlineFrom(formName, fileNameNoHTML, (err) => {
                if (err)
                    console.log(err.message);
                success++;
                if (success === length - remove)
                    callback();
            });
        } else {
            remove++;
            console.log("Online Forms: file \"" + fileName + "\" wasn\'t added as online form");
        }
    }
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

module.exports.findOnlineFormsIDsByFormsNames = (formsNames, callback) => {
    onlineFormAccessor.findOnlineFormsIDsByFormsNames(formsNames, callback);
};

module.exports.findOnlineFormsNamesByFormsIDs = (formsIDs, callback) => {
    onlineFormAccessor.findOnlineFormsNamesByFormsIDs(formsIDs, callback);
};

module.exports.getOnlineFormByName = (formName, callback) => {
    onlineFormAccessor.findOnlineFormByName(formName, callback);
};
