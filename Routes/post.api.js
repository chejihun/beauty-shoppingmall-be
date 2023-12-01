const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller')
const postController = require('../controllers/post.controller')

router.post(
  "/",
  authController.authenticate,
  postController.createPost
)

router.get("/", postController.getPost)

router.put(
  "/:id",
  authController.authenticate,
  postController.editPost
)

router.delete(
  "/:id",
  authController.authenticate,
  postController.deletePost
  )

router.get(
  "/:id",
  authController.authenticateLight,
  postController.getPostById
  );

module.exports = router;