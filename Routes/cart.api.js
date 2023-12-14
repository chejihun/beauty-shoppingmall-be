const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const cartController = require('../controllers/cart.controller')

router.post("/", authController.authenticate, cartController.addToCart)
router.get("/", authController.authenticate, cartController.getCart)
router.put("/:id", authController.authenticate, cartController.editCart)
router.delete("/:id", authController.authenticate, cartController.deleteCart)

// router.get ("/:id", authController.authenticate, cartController.getCartQty)
router.get ("/qty", authController.authenticate, cartController.getCartQty)

module.exports = router;