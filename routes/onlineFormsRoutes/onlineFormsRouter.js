let express = require('express');
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');
let router = express.Router();

router.post('/createAllOnlineForms', function (req, res) {
    onlineFormsController.createOnlineFrom("the form 1", "file1", (err) => {
        if (err) res.send(err);
        else {
            onlineFormsController.createOnlineFrom("the form 2", "file2", (err) => {
                if (err) res.send(err);
                else {
                    res.send("success")
                }
            });
        }
    });
});

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
                onlineForms[form.formName] = form.HTMLSource;
            });

            res.send(onlineForms);
        }
    });
});

router.get('/display', function (req, res) {
    onlineFormsController.getOnlineFormByName(req.query.formName, (err, form) => {
        if (err) res.send(err);
        else {
            res.render('onlineFormViews/' + form.HTMLSource, {formName: form.formName, isForShow: true});
        }
    })


});
module.exports = router;
