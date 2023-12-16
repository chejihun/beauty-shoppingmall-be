const orderController = {};
const Order = require("../Model/Order");
const productController = require("./product.controller");
const { randomStringGenerator } = require("../utils/randomStringGenerator")

orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { shipTo, contact, totalPrice, orderList } = req.body;

    //재고 확인 및 재고 업데이트 / 부족한 재고를 체크
    const stockItemCheck = await productController.checkItemListStock(orderList)
    //재고부족하면 에러 메세지 띄우기
    if (stockItemCheck.length > 0) {
      const errorMessage = stockItemCheck.reduce(
        (total, item) => total += item.message, "")
      throw new Error(errorMessage)
    }

    const newOrder = new Order({
      userId,
      shipTo,
      contact,
      totalPrice,
      items: orderList,
      orderNum: randomStringGenerator()
    });

    await newOrder.save()

    res.status(200).json({ status: 'success', orderNum: newOrder.orderNum})
  } catch (error) {
    return res.status(400).json({ status: "fail1", error: error.message });
  }
}

module.exports = orderController;