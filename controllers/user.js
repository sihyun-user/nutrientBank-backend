const User = require('../models/userModel');
const Food = require('../models/foodModel');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const catchAsync = require('../service/catchAsync');
const apiState = require('../service/apiState');
const appHelper = require('../service/appHelper');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const checkPassword = (password) => {
  const check = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return check.test(password);
};

// 會員註冊 API
exports.signup = catchAsync(async(req, res, next) => {
  let { name, email, password, confirmPassword } = req.body;
  // 資料欄位正確
  if (!name || !email || !password || !confirmPassword) {
    return appError(apiState.DATA_MISSING, next);
  };
  // 暱稱不為空
  if (validator.isEmpty(name.trim())) {
    return appError({statusCode: 400, message:'暱稱不為空白'}, next);
  };
  // 暱稱2個字元以上
  if (!validator.isLength(name.trim(), {min:2})) {
    return appError({statusCode: 400, message:'暱稱低於2個字元'}, next);
  };
  // 是否為正確E-mail
  if (!validator.isEmail(email)) {
    return appError({statusCode: 400, message:'E-mail格式錯誤'}, next);
  };
  // 密碼正確
  if (!checkPassword(password)) {
    return appError({statusCode: 400, message:'密碼需8位含或以上的字母數字'}, next);
  };
  // 密碼一致
  if (password !== confirmPassword) {
    return appError({statusCode: 400, message:'密碼不一致'}, next);
  };
  // E-mail不重複
  const data = await User.findOne({email}).exec();
  if (data) {
    return appError({statusCode: 400, message:'E-mail已被使用'}, next);
  };
  // 加密密碼
  password = await bcrypt.hash(password, 12);
  
  await User.create({ name, email, password, confirmPassword });

  appSuccess({ res, message: '註冊成功，請重新登入' });
});

// 會員登入 API
exports.login = catchAsync(async(req, res, next) => {
  const { email, password } = req.body;
  // 資料欄位正確
  if (!email || !password) {
    return appError(apiState.DATA_MISSING, next);
  };
  // 是否為正確E-mail
  if (!validator.isEmail(email)) {
    return appError({statusCode: 400, message:'E-mail格式錯誤'}, next);
  };
  // 密碼正確
  if (!checkPassword(password)) {
    return appError({statusCode: 400, message:'密碼需8位含或以上的字母數字'}, next);
  };

  const user = await User.findOne({email}).select('+password').exec();
  if (!user) {
    return appError({statusCode: 400, message:'E-mail帳號錯誤'}, next);
  };
  const checkPwd = await bcrypt.compare(password, user.password);
  if (!checkPwd) {
    return appError({statusCode: 400, message:'密碼錯誤'}, next);
  };
  const token = appHelper.generateSendJWT(user, res);

  const { name, _id, photo, sex } = user;
  let data = {
    user : { name, email, _id, photo, sex },
    token
  };
  
  appSuccess({ res, data, message: '登入成功' });
});

// 取得會員資料 API
exports.getProfile = catchAsync(async(req, res, next) => {
  const userId = req.userId;
  const data = await User.findById(userId)
  .select('-_id')
  .populate({
    path: 'likes',
    select: '-_id'
  }).exec();

  appSuccess({ res, data, message: '取得會員資料成功' });
});

// 更新會員資料 API
exports.updateProfile = catchAsync(async(req, res, next) => {
  const { name, sex, photo } = req.body;
  const userId = req.userId;
  // 資料欄位正確
  if (!name || !sex || !photo) {
    return appError(apiState.DATA_MISSING, next);
  };
  // 暱稱不為空
  if (validator.isEmpty(name.trim())) {
    return appError({statusCode: 400, message:'暱稱不為空白'}, next);
  };
  // 暱稱2個字元以上
  if (!validator.isLength(name.trim(), {min:2})) {
    return appError({statusCode: 400, message:'暱稱低於2個字元'}, next);
  };
  // 性別正確
  if (sex !== 'male' && sex !== 'female') {
    return appError({statusCode: 400, message:'性別未填寫正確(male、female)'}, next);
  };

  const data = await User.findByIdAndUpdate(userId, {
    name, sex, photo
  },{new: true, runValidators: true}).select('-_id').exec();

  appSuccess({ res, data, message: '更新會員資料成功' });
});

// 更新密碼 API
exports.updatePassword = catchAsync(async(req, res, next) => {
  let { password,  confirmPassword } = req.body;
  const userId = req.userId;
  // 資料欄位正確
  if (!password || !confirmPassword) {
    return appError(apiState.DATA_MISSING, next);
  };
  // 密碼正確
  if (!checkPassword(password)) {
    return appError({statusCode: 400, message:'密碼需8位含或以上的字母數字'}, next);
  };
  // 密碼一致
  if (password !== confirmPassword) {
    return appError({statusCode: 400, message:'密碼不一致'}, next);
  };
  // 加密密碼
  password = await bcrypt.hash(password, 12);
  await User.findByIdAndUpdate(userId, {password}).exec();

  appSuccess({ res, message: '更新密碼成功' });
});

// 新增食品書籤 API
exports.addFoodLike = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const foodId = req.params.foodId;

  const data = await Food.findById(foodId).exec();
  if (!data) return appError(apiState.DATA_NOT_FOUND, next);
  
  await User.updateOne(
    { 
      '_id': userId,
      'likes': { $ne: foodId }
    },
    { $addToSet: { likes: foodId } }
  );

  appSuccess({ res, message: '新增食品書籤成功' });
});

// 取消食品書籤 API
exports.cancelFoodLike = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const foodId = req.params.foodId;

  const data = await Food.findById(foodId).exec();
  if (!data) return appError(apiState.DATA_NOT_FOUND, next);

  await User.updateOne(
    { '_id': userId },
    { $pull: { likes: foodId } }
  );

  appSuccess({ res, message: '取消食品書籤成功' });
});

//TODO: 取得自訂食品列表 API
//TODO: 新增自訂食品 API
//TODO: 編輯自訂食品 API
//TODO: 刪除自訂食品 API