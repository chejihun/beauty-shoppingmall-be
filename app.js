const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const indexRouter = require('./Routes/index')

require('dotenv').config();
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' })); //용량제한 늘리기
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use('/api', indexRouter)

const mongoURI = process.env.LOCAL_DB_ADDRESS;
mongoose
  .connect(mongoURI)
  .then(() => console.log('mongoose connected'))
  .catch((error) => console.log('DB connection fail', error))

app.listen(process.env.PORT || 5000, () => {
  console.log('sever on')
});