const express = require('express');
const router = express.Router();
const ConcertController = require('../controllers/concerts.controller.js')

router.get('/concerts', ConcertController.getAll);

router.get('/concerts/:id', ConcertController.getConById);

router.post('/concerts', ConcertController.addCon);

router.put('/concerts/:id', ConcertController.editCon);

router.delete('/concerts/:id', ConcertController.delete)

module.exports = router;