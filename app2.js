var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
//app.set("view engine","jade")
app.set('view engine', 'ejs')

app.use(express.static("public"));
app.use(bodyParser.json());
var storage = multer.diskStorage({ //mul ters disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

/** API path that will upload the files */
function getdata() {
    var exceltojson;
    debugger
    upload(req, res, function (err) {
        if (err) {
            res.json({
                error_code: 1,
                err_desc: err
            });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({
                error_code: 1,
                err_desc: "No file passed"
            });
            return;
        }

        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        console.log(req.file.path);
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders: true
            }, function (err, result) {
                if (err) {
                    return res.json({
                        error_code: 1,
                        err_desc: err,
                        data: null
                    });
                }
                console.log(result)
                // res.render('home', {
                //     studentList: result
                // });
            });
        } catch (e) {
            res.json({
                error_code: 1,
                err_desc: "Corupted excel file"
            });
        }
    })
}
