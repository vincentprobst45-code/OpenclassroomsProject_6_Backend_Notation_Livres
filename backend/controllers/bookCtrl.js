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
      console.log(book)
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
  Book.updateOne({ _id: req.params.id }, { $set: updateFields }).then(() => {
      res.status(200).json({
        message: 'Book updated successfully!'
      });
    }
  ).catch((error) => {
      console.log(error);
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({_id: req.params.id}).then(() => {
      res.status(200).json({
        message: 'Book deleted!'
      });
    }
  ).catch((error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.rateBook = (req, res, next) => {
  const userId = req.body.userId
  const rating = req.body.rating

  Book.findOne({_id:req.params.id}).then((book)=>{
    if(book.ratings.map(rating => rating.userId).includes(userId))
    {
      console.log("User already gave notation")
      res.status(401).json({message : "User already gave notation"});
    }
    else{
      Book.updateOne({ _id: req.params.id }, 
        { $push: { ratings: {userId:userId, grade:rating} } }
      )
      .then(() => {

        let sumOfRatings = 0;
        Book.findOne({ _id: req.params.id })
        .then((book) =>{

          book.ratings.forEach(rating => {
            sumOfRatings += rating.grade;
          })
          Book.updateOne({ _id: req.params.id },  {averageRating: sumOfRatings/book.ratings.length })
          .then(() => {

            console.log("update ok")
            Book.findOne({ _id: req.params.id })
            .then((book) =>{ 

              console.log("sending book as response")
              res.status(200).send(book);
            })
            .catch((error) => {
            console.log(error);
            res.status(500).json({error: error});
            })
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json({error: error});
          });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({error: error});
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({error: error});
      });

    }
    
  })
  .catch((error) => {
    console.log(error);
    res.status(400).json({error: error});
  });
}