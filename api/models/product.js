const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    alias: 'id',
  },
  name: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number
  },
}, { toJSON: { virtuals: true } });

module.exports = mongoose.model('Product', productSchema)