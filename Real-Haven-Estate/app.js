require('express-async-errors');
const express = require('express');
const connectDb = require('./db/db-connection');
const { PORT } = require('./src/config/constants');
const notFound = require('./src/middlewares/not-found');
const errorHandler = require('./src/middlewares/error-handler');
const userRouter = require('./src/routers/user-routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use('/api/v1/user', userRouter);
app.use(errorHandler);
app.use(notFound);

const start = async () => {
  app.listen(PORT, () => console.log(`App started at port ${PORT} `));
  await connectDb();
};
start();
