const User = require('../models/userModel');
const catchAsync = require('../service/catchAsync');
const appError = require('../service/appError');
const jwt = require('jsonwebtoken');

exports.isAuth = catchAsync(async(req, res, next) => {
  let token;
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  };

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return appError({statusCode: 401, message: '尚未登入!'}, next);
      } else {
        resolve(payload)
      }
    })
  });

  const data = await User.findById(decoded.id);
  if (!data) return appError({statusCode: 401, message: '尚未登入!'}, next);

  req.userId = data._id;
  next();
});

exports.generateSendJWT = (user, res) => {
  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRSE_DAY
  });
  return token;
}; 