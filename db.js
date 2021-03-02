const spicedPg = require('spiced-pg');
const db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:postgres:postgres@localhost:5432/imageboard'
);

module.exports.getAllImages = () => {
    const q = `
            SELECT * 
            FROM images;
            `;
    return db.query(q);
};
module.exports.addImage = (title, username, description, url) => {
    const q = `
    INSERT INTO images (title, username, description, url)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const params = [title, username, description, url];
    return db.query(q, params);
};
