require('express-async-errors');
const express = require('express');
const cors = require('cors');
const { PORT } = require('./src/config/constants');
const notFound = require('./src/middlewares/not-found');
const errorHandler = require('./src/middlewares/error-handler');
const userRouter = require('./src/routers/user-routes');
const propertyRouter = require('./src/routers/property-route');
const connectDb = require('./db/db-connection');
const authRouter = require('./src/routers/oauth-routes');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('welcome to haven alalal again'));
app.use('/api/sessions', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/property', propertyRouter);
app.use(errorHandler);
app.use(notFound);

const start = async () => {
  await connectDb();
  app.listen(PORT, () => console.log(`App started at port ${PORT} `));
};
start();

module.exports = app;
