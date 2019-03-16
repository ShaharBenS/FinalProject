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
        this.getFilledOnlineFormByID(formIDs[i], (err, filledForm) => {
            if (err) callback(err);
            else {
                forms.push(filledForm);
                if (forms.length === formIDs.length) {
                    callback(null, forms)
                }
            }
        });
    }
    /* let myReduce = Object.keys(formIDs).reduce((prev, curr) => {
         return (err, onlineForm) => {
             if (err) prev(err);
             else {
                 forms.push(onlineForm);
                 this.getFilledOnlineFormByID(curr, prev);
             }
         }
     }, (err, onlineForm) => {
         if (err) {
             callback(err);
         } else {
             forms.push(onlineForm);
             callback(null, forms);
         }
     });
     myReduce(null);
 */

};