const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors({
  origin: true,
  exposedHeaders: '*',
  credentials: true,
}));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
