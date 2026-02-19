const Book = require('../models/book');

exports.getBooks = (req, res, next) => {
  Book.find().then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  }).then(
    (book) => {
      res.status(200).json(book);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.getBestRatings = (req, res, next) => {
  Book.find().then(
    (books) => {
      const top3 = books
        .slice()
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 3);
      res.status(200).json(top3);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.createBook = (req, res, next) => {

  const newBook = JSON.parse(req.body.book);
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

  const book = new Book({
    userId: newBook.userId,
    title: newBook.title,
    author: newBook.author,
    imageUrl: imageUrl,
    year: newBook.year,
    genre: newBook.genre,
    ratings: newBook.ratings,
    averageRating: newBook.averageRating
  });
  book.save().then(
    () => {
      res.status(201).json({
        message: 'Book saved successfully!'
      });
    }
  ).catch(
    (error) => {
      console.log(error)
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.modifyBook = (req, res, next) => {
  let updateFields = {};
  let newBook = req.body.book;
  if (typeof newBook === 'string') {
    try {
      newBook = JSON.parse(newBook);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid book JSON' });
    }
  }

  // Only set fields that are present in the request
  const allowedFields = ['userId', 'title', 'author', 'year', 'genre', 'ratings', 'averageRating'];
  allowedFields.forEach(field => {
    if (newBook[field] !== undefined) {
      updateFields[field] = newBook[field];
    }
  });

  // Handle image update if a new file is uploaded
  if (req.file) {
    updateFields.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }

  Book.updateOne({ _id: req.params.id }, { $set: updateFields }).then(
    () => {
      res.status(200).json({
        message: 'Book updated successfully!'
      });
    }
  ).catch(
    (error) => {
      console.log(error);
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Book deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.rateBook = (req, res, next) => {

}