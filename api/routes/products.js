const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .then((result) => {
      const products = result.map(p => {
        const { name, price, _id: id } = p;
        return {
          name,
          price,
          id,
          url: `${req.protocol}://${req.get('host')}${req.originalUrl}${id}`,
        };
      });
      res.status(200).json(products);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'DB error.',
      });
    });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  Product.findById(id)
    .select('name price _id')
    .then((product) => {
      console.log("success")
      if(product) {
        const { name, price, _id: id } = product;
        res.status(200).json({
          name,
          price,
          id,
        });
      } else {
        res.status(404).json({
          message: 'Product not found.',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: 'something broke'
      });
    });
});

router.post('/', (req, res, next) => {
  const { name, price } = req.body;
  const id = new mongoose.Types.ObjectId()
  const product = new Product({
    _id: id,
    name,
    price,
  });
  product.save()
    .then((result) => {
      console.log("success");
      res.status(201).json({
        name,
        price,
        id,
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}${id}`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Database error",
        error: err,
      });
    });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Product.remove({ _id: id })
    .then((response) => {
      if(response.n === 1) {
        res.status(200).json({ message: 'Product deleted.'});
      } else {
        res.status(404).json({ message: 'We cannot delete, what we cannot see.'});
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'DB error',
      });
    });
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  Product.update({ _id: id }, { $set: { ...req.body } })
    .then((response) => {
      if(response.n === 1) {
        res.status(204).json({ message: 'Product updated.'});
      } else {
        res.status(404).json({ message: 'We cannot delete, what we cannot see.'});
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'DB error',
      });
    });
});

module.exports = router;