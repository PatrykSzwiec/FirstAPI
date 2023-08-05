const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const db = [
  { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
  { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
  { id: 3, author: 'Michael Smith', text: 'Excellent service and friendly staff.' },
  { id: 4, author: 'Emily Johnson', text: 'I highly recommend their products.' },
  { id: 5, author: 'David Lee', text: 'The best experience I had in a long time.' },
  { id: 6, author: 'Sophia Wilson', text: 'Fast delivery and top-notch quality.' },
  { id: 7, author: 'Oliver Taylor', text: 'Great value for the price.' },
  { id: 8, author: 'Emma Brown', text: 'I am a satisfied customer.' },
  { id: 9, author: 'Noah Martinez', text: 'Their support team is very helpful.' },
  { id: 10, author: 'Isabella Anderson', text: 'Always a pleasure to do business with them.' },
];

// Parse JSON bodies and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ENDPOINTS  */

// GET__________________________________________________________________________________________

// get every element from db
app.get('/testimonials', (req, res) => {
  res.json(db);
});

// get random element from db 
app.get('/testimonials/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * db.length);
  const randomTestimonial = db[randomIndex];
  res.json(randomTestimonial);
});

// get element from db which id is selected
app.get('/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const testimonial = db.find((item) =>  item.id.toString() === id);
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
    db.push(newTestimonial);
    res.json({ message: 'OK' });
  } else {
    res.status(400).json({ message: 'Bad Request - Author and text are required' });
  }
});

// PUT__________________________________________________________________________________________
app.put('/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;

  const testimonialIndex = db.findIndex((item) => item.id.toString() === id);

  if (testimonialIndex !== -1 && author && text) {
    db[testimonialIndex] = { ...db[testimonialIndex], author, text };
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Testimonial not found or missing author and/or text' });
  }
});

// DELETE______________________________________________________________________________________________
app.delete('/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const testimonialIndex = db.findIndex((item) => item.id.toString() === id);

  if (testimonialIndex !== -1) {
    db.splice(testimonialIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Testimonial not found' });
  }
});

// Listening to server on port 8000
app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});