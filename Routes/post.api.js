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
  authController.checkAdminPermission,
  postController.updatePost
)

router.delete("/:id", (req, res) => {
  res.send("post delete")
})

router.get("/:id", postController.getPostById);

module.exports = router;