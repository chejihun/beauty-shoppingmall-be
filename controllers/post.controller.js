const Post = require('../Model/Post')
const User = require('../Model/User');
const mongoose = require('mongoose');
const postController = {}

postController.createPost = async (req, res) => {
  try {
    const { userId } = req;
    const { title, description, image, category, startDate, endDate  } = req.body

    const newPost = new Post({ title, description, image, category, userId, startDate, endDate  })
    await newPost.save();

    res.status(200).json({ status: "success", data: newPost });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

postController.getPost = async (req, res) => {
  try {
    const { page=1, withDescription=false, category, pageSize } = req.query;
    const skipAmount = (page - 1) * pageSize;

    const selectFields = withDescription ? '' : '-description';

    const [postList, totalPostNum] = await Promise.all([
      Post.find({category: {$in: [category]}})
        .sort({ createdAt: -1 })
        .skip(skipAmount)
        .limit(pageSize)
        .select(selectFields),
      Post.find({category: {$in: [category]}}).countDocuments()
    ])

    const userIdList = [...new Set(postList.map(post => post.userId))];
    const userList = await User.find({ _id: { $in: userIdList } });
    const updatedPostList = postList.map(post => {
      const user = userList.find(user => user._id.toString() === post.userId.toString());
      return {
        ...post.toObject(),
        userName: user ? user.name : 'Unknown',
      };
    });

    res.status(200).json({
      status: "success",
      data: updatedPostList,
      totalPostNum,
      page
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

postController.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) throw new Error("게시물을 찾을 수 없습니다.");
    const user = await User.findById(post.userId)

    const loggedInUserId = req.userId;
    const postAuthorId = post.userId.toString();
    const rightEditPost = loggedInUserId === postAuthorId;
    const postWithUserName = {
      ...post.toObject(),
      userName: user ? user.name : 'Unknown',
      rightEdit: rightEditPost,
    };

    res.status(200).json({ status: "success", data: postWithUserName });
  } catch (error) {
    return res.status(400).json({ status: "fail3", error: error.message });
  }
}

postController.editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, description, image, category } = req.body;
   
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, description, image, category },
      { new: true }
      
    );
    if (!updatedPost) {
      return res.status(404).json({ status: 'fail', error: '게시물을 찾을 수 없습니다.' });
    }
    res.status(200).json({ status: 'success', data: updatedPost })
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

postController.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletePost = await Post.findByIdAndDelete(postId);
    if (!deletePost) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }
    return res.status(200).json({ message: '게시물이 삭제되었습니다.', deletePost });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};


module.exports = postController;
