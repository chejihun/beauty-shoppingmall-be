const Cart = require('../Model/Cart')

const cartController = {}

cartController.addToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, size, qty } = req.body;
    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({ userId })
      await cart.save()
    }
    //카드에 제품이 들어가 있어도 사이즈는 다를 수 있기에 동시 체크할것
    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );
    if (existItem) {
      throw new Error("이미 장바구니에 담긴 상품입니다.")
    }
    cart.items = [...cart.items, { productId, size, qty }]
    await cart.save();
    res.status(200).json({ status: "success", data: cart, cartItemQty: cart.items.length })

  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

cartController.getCart = async (req, res) => {
  try {
    const { userId } = req
    const cart = await Cart.findOne({ userId }).populate({ //제품 추가 정보필요
      path:'items',
      populate:{
        path:'productId',
        model:'Product'
      }
    })
    res.status(200).json({ status: "success", data: cart.items })
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

module.exports = cartController;