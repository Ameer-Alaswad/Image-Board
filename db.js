const spicedPg = require('spiced-pg');
const db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:postgres:postgres@localhost:5432/imageboard'
);

module.exports.getAllImages = () => {
    const q = `
    SELECT * FROM images
    ORDER BY id DESC
    LIMIT 9;
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
module.exports.getImage = (imageId) => {
    const q = `
    SELECT * FROM images
     WHERE id=$1
    `;
    const params = [imageId];
    return db.query(q, params);
};

module.exports.getMoreImages = (id) => {
    const q = `
    SELECT id, url, title, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
    ) AS "lowestId" FROM images
    WHERE id <$1
    ORDER BY id DESC
    LIMIT 4
    `;
    const params = [id];
    return db.query(q, params);
};
module.exports.getMoreImages = (id) => {
    const q = `
    SELECT id, url, title, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
    ) AS "lowestId" FROM images
    WHERE id <$1
    ORDER BY id DESC
    LIMIT 4
    `;
    const params = [id];
    return db.query(q, params);
};
module.exports.getMoreImages = (id) => {
    const q = `
    SELECT *, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
    ) AS "lowestId" FROM images
    WHERE id <$1
    ORDER BY id DESC
    LIMIT 6
    `;
    const params = [id];
    return db.query(q, params);
};
module.exports.addComment = (username, comment, image_id) => {
    const q = `
    INSERT INTO comments (username, comment, image_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const params = [username, comment, image_id];
    return db.query(q, params);
};
module.exports.getComments = (imageId) => {
    const q = `
    SELECT * FROM comments
     WHERE image_id=$1
     ORDER BY id DESC
    `;
    const params = [imageId];
    return db.query(q, params);
};
