const express = require('express');
const db = require('./db.js');
const app = express();

app.use(express.static('public'));

app.get('/images', (req, res) => {
    db.getAllImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log('err in get route server js', err));
});
app.listen(8080, () => console.log('image board running'));
