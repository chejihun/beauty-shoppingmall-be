const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noticeSchema = Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: Array, required: true },
  image: { type: String }
}, { timestamps: true })

noticeSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.updateAt;
  delete obj.createAt;
  return obj;
}

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;

//공지사항 - 제목 / 작성자 / 작성날짜
//이벤트 - 제목 / 본문내용 / 이미지
//상품후기 - 제목 / 본문내용 / 이미지 