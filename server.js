const express = require('express');
const db = require('./db.js');
const app = express();
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3.js');
const { s3Url } = require('./config.json');

//////////////////////////
//// configure multer
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
///////////////////////////
app.use(express.static('public'));

//////////////////
app.get('/images', (req, res) => {
    db.getAllImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log('err in get route server js', err));
});
//////////////////////////////
////////
app.post('/upload', uploader.single('file'), s3.upload, function (req, res) {
    const { title, username, description } = req.body;
    const { filename } = req.file;
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        db.addImage(title, username, description, s3Url + filename).then(
            ({ rows }) => {
                console.log('rows', rows[0]);
                res.json({
                    success: true,
                    image: rows[0],
                });
            }
        );
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log('image board running'));
