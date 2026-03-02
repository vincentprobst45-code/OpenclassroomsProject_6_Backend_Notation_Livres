const sharp = require('sharp')

module.exports = async (req, res, next) => {
    
  let newBook
  if(req.body.book) {
    newBook = req.body.book
  } else {
    newBook = req.body
  }
  if (typeof newBook === 'string') {
    try {
      newBook = JSON.parse(newBook);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid book JSON' });
    }
  }
    try {
        if(req.file){
            await sharp(req.file.buffer)
            //.flatten({ background: '#ffffff' })
            .resize(800, 800, {
            fit: 'cover',
            })
            //.jpeg({ quality: 80 })
            .toBuffer()
        }
        next();
    }
    catch(error){
     console.log(error)
    }
}