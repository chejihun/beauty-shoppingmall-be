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

router.put("/:id", (req, res) => {
  res.send("post update")
})

router.delete("/:id", (req, res) => {
  res.send("post delete")
})


module.exports = router;