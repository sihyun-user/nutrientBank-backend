const User = require('../models/user');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const catchAsync = require('../service/catchAsync');
const apiState = require('../service/apiState');
const appHelper = require('../service/appHelper');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const checkPassword = (password) => {
  const check = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return check.test(password);
};

// 會員註冊 API
exports.signup = catchAsync(async(req, res, next) => {
  let { name, email, password, confirmPassword, isAdmin } = req.body;
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
  
  await User.create({ name, email, password, confirmPassword, isAdmin });

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

  const { name, id, photo, sex } = user;
  let data = {
    user : { name, email, id, photo, sex },
    token
  };
  
  appSuccess({ res, data, message: '登入成功' });
});

// 取得會員資料 API
exports.getProfile = catchAsync(async(req, res, next) => {
  const userId = req.userId;
  let data = await User.findById(userId).select('-_id');

  appSuccess({ res, data, message: '取得會員資料成功' });
});

// 編輯會員資料 API
exports.updateProfile = catchAsync(async(req, res, next) => {
  const { name, sex, birthday, height, weight, sportType, fitnessType, photo } = req.body;
  const userId = req.userId;
  const sportEnum = ['underSport', 'normalSport', 'moderateSport', 'severeSport', 'overSport'];
  const fitnessEnum = ['loseFat', 'gentleLoseFat', 'keepWeight', 'gentleAddFat', 'addFat'];
  // 資料欄位正確
  if (!name || !sex || !birthday || !height || !weight || !sportType || !fitnessType || !photo) {
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
  if (sex !== '0' && sex !== '1') {
    return appError({statusCode: 400, message:'性別未填寫正確'}, next);
  };
  // 生日正確
  if (birthday !== moment(birthday).format('YYYY-MM-DD')) {
    return appError({statusCode: 400, message:'生日未填寫正確'}, next);
  };
  // 身高正確
  if (height <= 0) {
    return appError({statusCode: 400, message:'身高未填寫正確'}, next);
  }
  // 體重正確
  if (weight <= 0) {
    return appError({statusCode: 400, message:'體重未填寫正確'}, next);
  }
  // 運動量
  const checkSportEnum = sportEnum.some((type) => sportType == type);
  if (!checkSportEnum) {
    return appError({statusCode: 400, message:'運動量未填寫正確'}, next);
  }
  // 健身目標
  const checkfitnessEnum = fitnessEnum.some((type) => fitnessType == type);
  if (!checkfitnessEnum) {
    return appError({statusCode: 400, message:'健身目標未填寫正確'}, next);
  }

  const data = await User.findByIdAndUpdate(userId, {
    name, sex, birthday, height, weight, sportType, fitnessType, photo
  },{new: true, runValidators: true}).select('-_id -isAdmin').exec();

  appSuccess({ res, data, message: '編輯會員資料成功' });
});

// 編輯密碼 API
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

  appSuccess({ res, message: '編輯密碼成功' });
});