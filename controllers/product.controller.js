const Product = require('../Model/Product')

const PAGE_SIZE = 5
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
//현재 프론트에서 제품리스트를 가져온 후 -> 정렬을 시키는데 이걸 백에서 정렬을 미리 한 후 ->
//프론트에서 그걸 불러오게 수정할것
productController.getProduct = async (req, res) => {
  try {
    const { page, name } = req.query 
    const SearchConditions = name ?
      { name: { $regex: name, $options: 'i' }, isDeleted: false }
      : { isDeleted: false }
    let query = Product.find(SearchConditions)
    let response = { status: "success" }
    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Product.find(SearchConditions).count()
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE)
      response.totalPageNum = totalPageNum
    }
    const productList = await query.exec()
    response.data = productList
    res.status(200).json(response);
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

productController.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isDeleted: true }
    )
    if (!product) {
      throw new Error("상품을 찾을 수 없습니다")
    }
    res.status(200).json({ status: 'success' })
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}

productController.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) throw new Error("상품을 찾을 수 없습니다.");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = productController;