let onlineFormSchema = require('../schemas/onlineFormsSchemas/OnlineFormSchema');
let OnlineForm = require('../../domainObjects/onlineForm');

/**
 *
 * @param newOnlineForm - online form schema record
 * @param callback
 */
module.exports.createOnlineForm = (newOnlineForm, callback) => {
    findOnlineFormByName(newOnlineForm.formName, (err, form) => {
        if (err || form === null)
            onlineFormSchema.create(newOnlineForm, callback);
        else callback(new Error("The form \"" + newOnlineForm.formName + "\" already exists in db"));
    });
};

/**
 *
 * @param formName - the form name
 * @param callback
 */
let findOnlineFormByName = function (formName, callback) {
    onlineFormSchema.findOne({formName: formName}, (err, res) => {
        if (err)
            callback(err);
        else if (res === null) callback(null, null);
        else callback(null, this.getOnlineFormFromSchemaRecord(res));
    });
};

/**
 * gets online form object by id
 * @param formID - ObjectID of online form
 * @param callback
 */
module.exports.findOnlineFormByID = (formID, callback) => {
    onlineFormSchema.findOne({_id: formID}, (err, res) => {
        if (err)
            callback(err);
        else callback(null, this.getOnlineFormFromSchemaRecord(res));
    });
};

module.exports.findOnlineFormsIDsByFormsNames = (formsNames, callback) => {
    onlineFormSchema.find({formName: {$in :formsNames}}, (err, res) => {
        if (err)
            callback(err);
        else
        {
            let onlineForms = [];
            res.forEach((frmObject)=>{
                onlineForms.push(frmObject._id)
            });
            callback(null,onlineForms);
        }
    });
};

module.exports.findOnlineFormsNamesByFormsIDs = (formsIDs, callback) => {
    onlineFormSchema.find({_id: {$in :formsIDs}}, (err, res) => {
        if (err)
            callback(err);
        else
        {
            let onlineForms = [];
            res.forEach((frmObject)=>{
                onlineForms.push(frmObject.formName);
            });
            callback(null,onlineForms);
        }
    });
};

/**
 * Gets all available online form as OnlineForm object
 * @param callback
 */
module.exports.findAllOnlineForms = (callback) => {
    onlineFormSchema.find({}, (err, onlineFormsArray) => {
        if (err) callback(err);
        else {
            let onlineFormsObjects = [];
            onlineFormsArray.forEach((form) => {
                onlineFormsObjects.push(this.getOnlineFormFromSchemaRecord(form));
            });
            callback(null, onlineFormsObjects)
        }
    });
};

/**
 *  Converts OnlineForm schema record to OnlineForm object
 *  @param form - type: map, schema of online form
 */
module.exports.getOnlineFormFromSchemaRecord = (form) => {
    return new OnlineForm(form.formName, form.HTMLSource, form._id)
};

/**
 *  Converts OnlineForm object to OnlineForm schema record
 *  @param form - type: OnlineForm
 */
module.exports.getSchemaRecordFromOnlineForm = (form) => {
    return {formName: form.formName, HTMLSource: form.HTMLSource}
};


module.exports.findOnlineFormByName = findOnlineFormByName;