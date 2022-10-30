const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger-output');

// controller
const errorController = require('./controllers/error');

// service
const apiState = require('./service/apiState');
const appError = require('./service/appError');

// router
const userRouter = require('./routes/user');
const foodRouter = require('./routes/food');
const diaryRouter = require('./routes/diary');
const customFoodRouter = require('./routes/customFood');

const app = express();

require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', userRouter);
app.use('/api', foodRouter);
app.use('/api', customFoodRouter);
app.use('/api', diaryRouter);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 404
app.use('*',(req, res, next) => {
  appError(apiState.PAGE_NOT_FOUND, next);
});

app.use(errorController);

module.exports = app;
