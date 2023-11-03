const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./Product');
const Order = require('./Order');

const orderItemSchema = Schema({
  orderId: { type: mongoose.ObjectId, ref: Order },
  productId: { type: mongoose.ObjectId, ref: Product },
  size: { type: String, required: true },
  qty: { type: Number, default: 1, required: true },
  price: { type: Number, required: true }

}, { timestamps: true });

orderItemSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updateAt;
  return obj;
}

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;