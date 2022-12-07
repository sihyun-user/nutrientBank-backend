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
  req.isAdmin = data.isAdmin;
  next();
});

exports.isAdmin = (req,res, next) => {
  if (!req.isAdmin) appError({statusCode: 403, message: '你沒有管理員權限!'}, next);
  next();
};

exports.generateSendJWT = (user, res) => {
  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRSE_DAY
  });
  return token;
};

exports.verifyFood = (data, next) => {
  let { name, subName, brand, perUnitWeight, unit, nutrition, type } = data;
  let ingredientType = ['calories','carbohydrates', 'protein', 'fat', 'saturated_fat', 'trans_fat', 'sodium', 'sugar'];
  const unitType = ['g','ml'];
  // 食品名稱欄位正確
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
  // 食品重含量欄位正確
  if (!perUnitWeight) {
    return appError({statusCode: 400, message:'食品重含量必填欄位'}, next);
  };
  // 食品重含量不為負值
  if (perUnitWeight < 0) {
    return appError({statusCode: 400, message:'食品重含量未填寫正確'}, next);
  };
  // 食品重含量單位欄位正確
  if (!unit) {
    return appError({statusCode: 400, message:'食品重含量單位必填欄位'}, next);
  };
  // 食品重含量單位驗證
  if (!unitType.includes(unit.trim())) {
    return appError({statusCode: 400, message:'食品重含量單位未填寫正確(g、ml)'}, next);
  };
  // 食品營養成分欄位正確
  const checkAllKeys = ingredientType.every((type) => nutrition.hasOwnProperty(type));
  if (!checkAllKeys) {
    return appError({statusCode: 400, message:`食品營養成分欄位未填寫正確`}, next);
  }
  // 食品營養成分四捨五入取小數點後一位
  for(let key in nutrition) {
    let value = +nutrition[key]
    nutrition[key] = +value.toFixed(1);
  };
  console.log(type)
  // 食品類型正確
  if (type!=='food'&&type!=='customFood') {
    return appError({statusCode: 400, message:`食品類型未填寫正確`}, next);
  }
};