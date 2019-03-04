let express = require('express');
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');
let router = express.Router();

/*
   _____ ______ _______
  / ____|  ____|__   __|
 | |  __| |__     | |
 | | |_ |  __|    | |
 | |__| | |____   | |
  \_____|______|  |_|

 */

router.get('/getAllOnlineForms', function (req, res) {
    onlineFormsController.getAllOnlineForms((err, forms) => {
        if (err) res.send(err);
        else {
            let onlineForms = {};
            forms.forEach((form) => {
                onlineForms[form.formName] = form.srcFileName;
            });
            res.send(onlineForms);
        }
    });
});

module.exports = router;
