const Product = require('../Model/Product')

const PAGE_SIZE = 10
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
    const { page=1, name} = req.query

    const SearchConditions = name ?
      { name: { $regex: name, $options: 'i' }, isDeleted: false }
      : { isDeleted: false }
    let query = Product.find(SearchConditions)
    let response = { status: "success" }
    
    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).sort({ createdAt: -1 })
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
    // product의 category 로 Product list 쿼리 ($in})를 한다. 
    // return 할 떄, product 내부에 list 데이터도 추가한다.  (아래 보이는 것들)
    // 요청을 2번하지 말고, 한꺼번에 가져오기 
    // Post 쪽 참고하기.
    if (!product) throw new Error("상품을 찾을 수 없습니다.");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.checkStock = async (item) => {
  // 구매하려는 제품 재고 정보체크하고 사이즈/수량 비교
  // 재고 부족이면 에러 보내고 아니면 기존 재고에서 구매 수량 뺴기
  const product = await Product.findById(item.productId)
  if (product.stock[item.size] < item.qty) {
    return { isVerify: false, message: `${product.name}의 ${item.size} 재고가 부족합니다` }
  }
  const newStock = { ...product.stock }
  newStock[item.size] -= item.qty
  product.stock = newStock

  await product.save()
  return { isVerify: true }
}

productController.checkItemListStock = async (itemList) => {

  const stockItemCheck = []
  await Promise.all(
    itemList.map(async (item) => {
      const stockCheck = await productController.checkStock(item)
      if (!stockCheck.isVerify) {
        stockItemCheck.push({ item, message: stockCheck.message })
      }
      return stockCheck;
    })
  );
  return stockItemCheck;
}


module.exports = productController;