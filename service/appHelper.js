const User = require('../models/user');
const catchAsync = require('../service/catchAsync');
const appError = require('../service/appError');
const validator = require('validator');
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

// TODO: 缺少檢查每個成分的單位值是否正確(是否需要填寫單位)
// TODO: 判斷食品重含量是否需要填寫單位克
exports.verifyFood = (data, next) => {
  let { name, subName, brand, perUnitWeight, nutrition } = data;
  let ingredientType = ['糖','碳水化合物', '反式脂肪', '熱量', '脂肪', '蛋白質', '鈉', '飽和脂肪'];
  let unitType = ['g', 'mg', 'ml', 'kcal'];
  // 資料欄位正確
  if (!name) {
    return appError({statusCode: 400, message:'食品名稱為必填欄位'}, next);
  };
  // 食品名稱不為空白
  if (validator.isEmpty(name.trim())) {
    return appError({statusCode: 400, message:'食品名稱不為空白'}, next);
  };
  // 食品名稱2個字元以上
  if (!validator.isLength(name.trim(), {min:2})) {
    return appError({statusCode: 400, message:'食品名稱低於2個字元'}, next);
  };
  // 食品英文名稱不為空白(選填)
  if (subName && validator.isEmpty(subName.trim())) {
    return appError({statusCode: 400, message:'食品英文名稱不為空白'}, next);
  };
  // 食品英文名稱2個字元以上(選填)
  if (subName && !validator.isLength(subName.trim(), {min:2})) {
    return appError({statusCode: 400, message:'食品英文名稱低於2個字元'}, next);
  };
  // 食品品牌名稱不為空白(選填)
  if (brand && validator.isEmpty(brand.trim())) {
    return appError({statusCode: 400, message:'食品品牌名稱不為空白'}, next);
  };
  // 食品品牌名稱2個字元以上(選填)
  if (brand && !validator.isLength(brand.trim(), {min:2})) {
    return appError({statusCode: 400, message:'食品品牌名稱低於2個字元'}, next);
  };
  // 食品重含量不為空白(選填)
  if (perUnitWeight && validator.isEmpty(perUnitWeight.trim())) {
    return appError({statusCode: 400, message:'食品重含量不為空白'}, next);
  };
  // 食品重含量2個字元以上且包含單位(選填)
  if (perUnitWeight && (!validator.isLength(perUnitWeight.trim(), {min:2}) || !perUnitWeight.includes('克'))) {
    return appError({statusCode: 400, message:'食品重含量未填寫正確(2個字元以上且包含單位(克))'}, next);
  };
  // 食品營養成分欄位正確
  if (nutrition.length !== 8) {
    return appError({statusCode: 400, message:`食品營養成分未填寫正確(${ingredientType})`}, next);
  } else {
    nutrition.find((nut) => {
      if (!ingredientType.includes(nut.ingredient)) {
        return appError({statusCode: 400, message:`食品營養成分名稱未填寫正確(${ingredientType})`}, next);
      };
      if (!unitType.some(type => nut.unit == type)) {
        return appError({statusCode: 400, message:`食品營養成分單位未填寫正確(${unitType})`}, next);
      };
      let newCount = nut.perUnitContent.trim();
      if (newCount < 0) {
        return appError({statusCode: 400, message:'食品營養成分重含量未填寫正確'}, next);
      };
    });
  };
};