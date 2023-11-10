const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const authController = {}

//로그인
authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body
    let user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await user.generateToken();
        return res.status(200).json({ status: 'success', user, token });
      }
    }
    throw new Error("이메일 혹은 비밀번호가 잘못되었습니다.")
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization
    if (!tokenString) { throw new Error("토큰을 찾을 수 없습니다") };
    const token = tokenString.replace('Bearer ', '');
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) { throw new Error("유효하지 않은 토큰입니다") };
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

authController.checkAdminPermission = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId)
    if (user.level !== "admin") {
      throw new Error("접근 권한이 없습니다.")
    }
    next();

  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
}



module.exports = authController;