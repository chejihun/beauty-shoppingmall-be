const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const postSchema = Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  category: { type: Array, required: true },
  userId: { type: mongoose.ObjectId, ref: User },
}, { timestamps: true });

postSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.updateAt;
  return obj;
};

const Post = mongoose.model('Post', postSchema);
module.exports = Post;