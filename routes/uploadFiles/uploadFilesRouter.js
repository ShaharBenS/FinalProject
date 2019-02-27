let express = require('express');
let router = express.Router();
let formidable = require('formidable');
let fs = require('fs');

router.get('/', function (req, res) {
        res.render('uploadFileViews/upload');
});

router.post('/upload_file', function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let oldpath = files.filetoupload.path;
        let newpath = 'C:/Users/Kuti/Desktop/' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
        });
    });
});

router.post('/download_file',(req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let path = fields.filetodownload;
        console.log(path);
        res.download(path, path);
    });

});

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

module.exports = router;