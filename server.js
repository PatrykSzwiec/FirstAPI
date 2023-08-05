const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ENDPOINTS  */

// GET__________________________________________________________________________________________

// get every testimonials element from db
app.get('/testimonials', (req, res) => {
  res.json(db.testimonials);
});

// get random testimonials element from db 
app.get('/testimonials/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * db.testimonials.length);
  const randomTestimonial = db.testimonials[randomIndex];
  res.json(randomTestimonial);
});

// get testimonials element from db which id is selected
app.get('/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const testimonial = db.testimonials.find((item) =>  item.id.toString() === id);
  if(testimonial) {
    res.json(testimonial);
  } else {
    res.status(404).json({ message: 'Testimonial not found'});
  }
});

app.get('/concerts', (req, res) => {
  res.json(db.concerts);
});

app.get('/concerts/:id', (req, res) => {
  const { id } = req.params;
  const concert = db.concerts.find((item) => item.id.toString() === id);
  if(concert) {
    res.json(concert);
  } else {
    res.status(404).json({ message: 'Concert not found'});
  }
});

// POST_________________________________________________________________________________________
app.post('/testimonials', (req, res) => {
  const { author, text } = req.body;
  if (author && text) {
    const newTestimonial = {
      id: uuidv4(), // Generate a random ID using uuid
      author,
      text,
    };
    db.testimonials.push(newTestimonial);
    res.json({ message: 'OK' });
  } else {
    res.status(400).json({ message: 'Bad Request - Author and text are required' });
  }
});

app.post('/concerts', (req, res) => {
  const { performer, genre, price, day, image} = req.body;
  if (performer && genre && price && day && image) {
    const newConcert = {
      id: uuidv4(),
      performer,
      genre,
      price,
      day,
      image,
    };
    db.concerts.push(newConcert);
    res.json({ message: 'OK'});
  } else {
    res.status(400).json({ message: 'Bad Request - all fields required' });
  }
});

// PUT__________________________________________________________________________________________
app.put('/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;

  const testimonialIndex = db.testimonials.findIndex((item) => item.id.toString() === id);

  if (testimonialIndex !== -1 && author && text) {
    db.testimonials[testimonialIndex] = { ...db.testimonials[testimonialIndex], author, text };
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Testimonial not found or missing author and/or text' });
  }
});

app.put('/concerts/:id', (req, res) => {
  const { id } = req.params;
  const { performer, genre, price, day, image } = req.body;

  const concertIndex = db.concerts.findIndex((item) => item.id.toString() === id);

  if(concertIndex !== -1 && performer && genre && price && day && image) {
    db.concerts[concertIndex] = { ...db.concerts[concertIndex, performer, genre, price, day, image]};
    res.json({ message: 'OK' })
  } else {
    res.status(404).json({ message: 'Concert not found or missing data'});
  }
});

// DELETE______________________________________________________________________________________________
app.delete('/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const testimonialIndex = db.testimonials.findIndex((item) => item.id.toString() === id);

  if (testimonialIndex !== -1) {
    db.testimonials.splice(testimonialIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Testimonial not found' });
  }
});

app.delete('/concerts/:id', (req, res) => {
  const { id } = req.params;
  const concertIndex = db.concerts.findIndex((item) => item.id.toString() === id);

  if(concertIndex !== -1) {
    db.concerts.splice(concertIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Concert not found' });
  }
});
/* ------------------------------------------------------------ */
app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

// Listening to server on port 8000
app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});