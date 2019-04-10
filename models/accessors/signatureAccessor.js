let signaturesSchema = require('../schemas/usersSchemas/UsersSignaturesSchema');

module.exports.getSignature = (userEmail, callback) => {
    signaturesSchema.find({userEmail: userEmail}, (err, result) => {
        if (err) callback(err);
        else if (result.length === 0) callback(null, null);
        else callback(null, result[0].signature);
    });
};

module.exports.addSignature = (userEmail, signature, callback) => {
    return signaturesSchema.create({userEmail: userEmail, signature: signature}, callback);
};

module.exports.updateSignature = (userEmail, signature, callback) => {
    return signaturesSchema.updateOne({userEmail: userEmail}, {$set: {signature: signature}}, callback);
};