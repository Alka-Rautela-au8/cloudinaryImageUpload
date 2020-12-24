const multer = require('multer');
// const path = require('path');

// multer config
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter : (req, file, next) => {

        console.log("file.mimetype  --> ", file.mimetype)

        if(!file.mimetype.startsWith('image')){
            return next(new Error('Please upload an image file'), 400);
        }
        next(null, true)
    }
})