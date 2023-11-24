const Post = require('../Model/Post')
const postController = {}

postController.createPost = async (req, res) => {
  try {
    const { title, description, image, category, name  } = req.body
    const newPost = new Post({ title, description, image, category, name })
    await newPost.save();

    res.status(200).json({ status: "success", data: newPost });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

postController.getPost = async (req, res) => {
  try {
    const postList = await Post.find({});
    res.status(200).json({ status: "success", data: postList });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

module.exports = postController;
