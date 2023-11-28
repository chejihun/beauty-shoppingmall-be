const Post = require('../Model/Post')
const User = require('../Model/User');
const mongoose = require('mongoose');
const postController = {}
const PAGE_SIZE = 5

postController.createPost = async (req, res) => {
  try {
    const { userId } = req;
    const { title, description, image, category } = req.body
    const newPost = new Post({ title, description, image, category, userId })
    await newPost.save();

    res.status(200).json({ status: "success", data: newPost });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

postController.getPost = async (req, res) => {
  try {
    const { page } = req.query;
    const skipAmount = (page - 1) * PAGE_SIZE;

    const postList = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(PAGE_SIZE)

    const userIdList = [...new Set(postList.map(post => post.userId))];
    // console.log('userIdList:', userIdList);
    const userList = await User.find({ _id: { $in: userIdList } });
    // console.log('userList:', userList);

    const updatedPostList = postList.map(post => {
      const user = userList.find(user => user._id.toString() === post.userId.toString());
      return {
        ...post.toObject(), 
        userName: user ? user.name : 'Unknown',
      };
    });
    // console.log('postList:', updatedPostList);

    const totalPostNum = await Post.find({}).countDocuments();
    const totalPageNum = Math.ceil(totalPostNum / PAGE_SIZE);

    res.status(200).json({
      status: "success",
      data: updatedPostList,
      totalPageNum: totalPageNum,
    });
    // console.log('postList:', updatedPostList);
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

postController.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) throw new Error("게시물을 찾을 수 없습니다.");
    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    return res.status(400).json({ status: "fail3", error: error.message });
  }
}

postController.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, description, image, category } = req.body
    const Post = await Post.findByIdAndUpdate(
      { _id: postId },
      { title, description, image, category },
      { new: true }
    )
    if (!post) {
      throw new Error("게시물이 존재하지 않습니다")
    }
    res.status(200).json({ status: 'success', data: post })
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

module.exports = postController;
