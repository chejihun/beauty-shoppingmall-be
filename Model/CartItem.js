const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./Product');
const Cart = require('./Cart');

const cartItemSchema = Schema({
  cartId: { type: mongoose.ObjectId, ref: Cart },
  productId: { type: mongoose.ObjectId, ref: Product },
  size: { type: String, required: true },
  qty: { type: Number, default: 1, required: true }
}, { timestamps: true });

cartItemSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updateAt;
  return obj;
}

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;