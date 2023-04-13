const multer = require('multer');
const path = require('path');

// Multer config
module.exports = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { folder } = req.params;
            cb(null, `public/upload/image`);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    }),
});
