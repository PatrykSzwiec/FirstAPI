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

// get every element from db
app.get('/testimonials', (req, res) => {
  res.json(db.testimonials);
});

// get random element from db 
app.get('/testimonials/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * db.testimonials.length);
  const randomTestimonial = db.testimonials[randomIndex];
  res.json(randomTestimonial);
});

// get element from db which id is selected
app.get('/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const testimonial = db.testimonials.find((item) =>  item.id.toString() === id);
  if(testimonial) {
    res.json(testimonial);
  } else {
    res.status(404).json({ message: 'Testimonial not found'});
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

// PUT__________________________________________________________________________________________
app.put('/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;

  const testimonialIndex = db.testimonials.findIndex((item) => item.id.toString() === id);

  if (testimonialIndex !== -1 && author && text) {
    db[testimonialIndex] = { ...db.testimonials[testimonialIndex], author, text };
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Testimonial not found or missing author and/or text' });
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

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

// Listening to server on port 8000
app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});