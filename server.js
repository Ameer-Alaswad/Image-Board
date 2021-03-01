const express = require('express');
const db = require('./db.js');
const app = express();
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

app.use(express.static('public'));
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
app.post('/upload', uploader.single('file'), function (req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        res.json({
            success: true,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log('image board running'));
