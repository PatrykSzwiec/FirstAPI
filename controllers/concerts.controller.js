const Concert = require('../models/concert.model')

exports.getAll = async (req, res) => {
    try {
        res.json(await Concert.find());
    }
    catch (err) {
        res.status(500).json({ message: err});
    };
};


exports.getConById = async (req, res) => {
    try {
      const con = await Concert.findById(req.params.id);
      if(!con) res.status(404).json({ message: 'Not found' });
      else res.json(con);
    }
    catch(err) {
      res.status(500).json({ message: err });
    };
  };

exports.addCon = async (req, res) => {
    try {
      const { performer, genre, price, day, image } = req.body;
      const newConcert = new Concert({ performer: performer, genre: genre, price: price, day: day, image: image });
      await newConcert.save();
      res.json(await Concert.find());
    } 
    catch(err) {
      res.status(500).json({ message: err });
    };
};

exports.editCon = async (req, res) => {
    const { performer, genre, price, day, image } = req.body;
    try {
      const con = await Concert.findById(req.params.id);
      if(con) {
        await Concert.updateOne({ _id: req.params.id }, { $set: { performer: performer, genre: genre, price: price, day: day, image: image }});
        res.json(con);
      }
      else res.status(404).json({ message: 'Not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };

  exports.delete = async (req, res) => {
    try {
      const con = await Concert.findById(req.params.id);
      if(con) {
        con.remove()
        res.json(await Concert.find())
      }
      else res.status(404).json({ message: 'NotFound...' })
    }
    catch(err) {
      res.status(505).json({ message: err })
    }
  };