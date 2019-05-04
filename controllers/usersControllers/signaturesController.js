let signatureAccessor = require('../../models/accessors/signatureAccessor');

let errMsg = "חתימה לא קיימת עבור המשתמש הזה";

/**
 * returns the signature string from the db
 * @param userEmail
 * @param callback
 */
module.exports.getSignature = (userEmail, callback) => {
    signatureAccessor.getSignature(userEmail, (err, signature) => {
        if (err) callback(err);
        else if (signature === null) callback(new Error(errMsg));
        else callback(null, signature);
    });
};

/**
 * adds signature string to the db
 * @param userEmail
 * @param signature
 * @param callback
 */
module.exports.addSignature = (userEmail, signature, callback) => {
    signatureAccessor.addSignature(userEmail, signature, callback);
};

/**
 * if the signature exists - update it on db, otherwise - add it to db
 * @param userEmail
 * @param signature
 * @param callback
 */
module.exports.updateSignature = (userEmail, signature, callback) => {
    this.getSignature(userEmail, (err) => {
        if (err !== null)
            this.addSignature(userEmail, signature, callback);
        else signatureAccessor.updateSignature(userEmail, signature, callback);
    })
};
