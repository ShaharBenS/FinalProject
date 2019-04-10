let express = require('express');
let signaturesController = require('../../controllers/usersControllers/signaturesController');
const formidable = require("formidable");
let router = express.Router();

let successCode = 'success';

router.get('/getSignature', function (req, res) {
    let userEmail = req.user.emails[0].value;
    signaturesController.getSignature(userEmail, (err, signature) => {
        if (err) res.status(500).send(err);
        else {
            res.send(signature);
        }
    });
});

router.post('/updateSignature', function (req, res) {
    let userEmail = req.user.emails[0].value;
    let data = new formidable.IncomingForm();
    data.parse(req, function (err, fields) {
        let signature = fields.signature;
        signaturesController.updateSignature(userEmail, signature, (err, updateResult) => {
            if (err) res.send(err);
            else res.send(successCode);
        })
    });

});

module.exports = router;
