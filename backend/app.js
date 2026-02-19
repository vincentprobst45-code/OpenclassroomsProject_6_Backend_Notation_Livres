const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const path = require('path');

mongoose.connect('mongodb+srv://User0:ABEzRCaihY8z1uE2@clusterocr.lvbjuse.mongodb.net/myDatabase?retryWrites=true&w=majority', {})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Connexion à MongoDB échouée !', err));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// 404 handler for unknown routes — respond with JSON instead of swallowing the request
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ressource non trouvée.' });
});


module.exports = app;