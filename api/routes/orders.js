const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const router = express.Router();

router.get('/', (req, res) => {
  Order.find()
    .select('_id productId quantity')
    .populate('productId')
    .then(result => {
      const orders = result
        .map(({ _id: id, productId, quantity }) => ({
          id,
          productId,
          quantity,
        }));
      res.status(200).json(orders);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Order.findById(id)
    .then(result => {
      const { _id: id, productId, quantity } = result;
      res.status(200).json({ id, productId, quantity });
    })
    .catch(({ name }) => {
      
      if(name && name.includes('Error')) {
        console.log(name)
        res.status(500).json({
          message: 'Internal server error',
        });
      } else {
        res.status(404).json({
          message: 'Order not found'
        });
      }
    });
});

router.post('/', (req, res) => {
  console.log('asd')
  const { productId, quantity } = req.body;
  Product.findById(productId)
    .then(prod => {
      if(!prod) {
        res.status(500).json({
          message:'Invalid product id',
        });
      } else {
        const order = new Order({
          _id: new mongoose.Types.ObjectId(),
          productId,
          quantity,
        });
        return order.save()
      }
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'order created',
        order: { productId, quantity }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error
      });
    })
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const { productId } = req.body;
  Product.findById(productId)
    .then(prod => {
      if(!prod) {
        res.status(500).json({
          message:'Invalid product id',
        });
      } else {
        console.log('update')
        return Order.update({ _id: id }, { $set: { ...req.body } });
      }
    })
    .then((response) => {
      if(response.n === 1) {
        res.status(204).send();
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

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Order.findByIdAndRemove(id)
    .then(() => {
      res.status(200).json({ message: 'Product removed' });
    })
    .catch(({ name }) => {
      if(name && name.includes('Error')) {
        res.status(500).json({
          message: 'Internal server error',
        });
      } else {
        res.status(404).json({
          message: 'Order not found'
        });
      }
    });
});

module.exports = router;