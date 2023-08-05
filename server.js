const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const testimonialsRouter = require('./routes/testimonials.routes');
const concertsRouter = require('./routes/concerts.routes');
const seatsRouter = require('./routes/seats.routes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ENDPOINTS  */

app.use('/testimonials', testimonialsRouter);
app.use('/concerts', concertsRouter);
app.use('/seats', seatsRouter);

/* ------------------------------------------------------------ */
app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

// Listening to server on port 8000
app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});