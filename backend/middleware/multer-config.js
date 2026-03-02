const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();

const filter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === 'image') {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"));
    }
};

const upload = multer({ storage: storage, fileFilter: filter }).single('image');

const resizeImage = async (req, res, next) => {
    if (!req.file) return next();
    // Generate filename
    const ext = path.extname(req.file.originalname) || '.jpg';
    const name = req.file.originalname.split(' ').join('_').replace(ext, '');
    const filename = name + '_' + Date.now() + ext;//'.jpg';
    const outputPath = path.join(__dirname, '../images', filename);

    // if(req.method === "PUT"){

    // }

    try {
        await sharp(req.file.buffer)
            //.flatten({ background: '#ffffff' })
            .resize(600, 600, { fit: 'cover' })
            //.jpeg({ quality: 80 })
            .toFile(outputPath);
        req.file.filename = filename;
        req.file.path = outputPath;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = [upload, resizeImage];
