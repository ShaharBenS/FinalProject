const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UsersSignaturesSchema = new Schema({
    userEmail: {type: String, unique: true},
    signature: String
});

module.exports = mongoose.model('UsersSignatures', UsersSignaturesSchema);