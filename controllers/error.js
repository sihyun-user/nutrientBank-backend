const apiState = require('../service/apiState');  

// 自訂錯誤訊息
const setError = (customError, err) => {
  err.message = customError.message
  err.status = customError.status
  err.statusCode = customError.statusCode
  err.isOperational = true
}; 

// 正式環境錯誤
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    // log 紀錄
    console.error('出現重大錯誤', err);
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請洽系統管理員'
    });
  }
};

// 開發環境錯誤
const resErrorDev = (err, res) => {
  console.log('err:💥💥', err)
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack
  });
};

// 錯誤處理
const handleError = (err, req, res, next) => {
  const idDev = process.env.NODE_ENV === 'development';
  err.statusCode = err.statusCode || 500;
  
  if (err instanceof SyntaxError) {
    setError(apiState.SYNTAX_ERROR, err);
  };
  
  if (err.name === 'ValidationError') {
    setError(apiState.DATA_MISSING, err);
  };
  
  if (err.name === 'CastError') {
    setError(apiState.ID_ERROR, err);
  };
  
  idDev ? resErrorDev(err, res) : resErrorProd(err, res);
};

module.exports =  (err, req, res, next) => {
  handleError(err, req, res, next);
};