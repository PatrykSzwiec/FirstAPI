const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');

const app = express();

// import routes
const testimonialsRouter = require('./routes/testimonials.routes');
const concertsRouter = require('./routes/concerts.routes');
const seatsRouter = require('./routes/seats.routes');

// Use cors middleware with appropriate configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with the URL of your React app
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});
const io = socket(server);

// Socket.IO event listener for 'connection'
io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ENDPOINTS  */

app.use('/api/testimonials', testimonialsRouter);
app.use('/api/concerts', concertsRouter);
app.use('/api/seats', seatsRouter);

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

/* ------------------------------------------------------------ */
app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

