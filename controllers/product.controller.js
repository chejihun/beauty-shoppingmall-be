const Product = require('../Model/Product')

const productController = {}

productController.createProduct = async (req, res) => {
  try {
    const { sku, name, size, image, category, description, stock, status, price } = req.body
    const product = new Product({
      sku,
      name,
      size,
      image,
      category,
      description,
      stock,
      status,
      price
    })
    await product.save();
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

productController.getProduct = async (req, res) => {
  try {
    const { page, name } = req.query
    const SearchConditions = name ? { name: { $regex: name, $options: 'i' } } : {}
    let query = Product.find(SearchConditions)

    const productList = await query.exec()
    res.status(200).json({ status: 'success', data: productList });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

productController.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { sku, name, size, image, category, description, stock, status, price } = req.body
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { sku, name, size, image, category, description, stock, status, price },
      { new: true }
    );
    if (!product) {
      throw new Error("상품이 존재하지 않습니다")
    }
    res.status(200).json({ status: 'success', data: product })
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}
module.exports = productController;