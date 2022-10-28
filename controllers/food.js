const Food = require('../models/foodModel');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const catchAsync = require('../service/catchAsync');
const apiState = require('../service/apiState');
const validator = require('validator');

// 取得食品列表 API
exports.getAllFood = catchAsync(async (req, res, next) => {
  let { search, page = 1, limit = 10 } = req.query;

  let newSearch = search !== undefined ? search.trim() : '';
  let keyword = search !== undefined ? { 
    $or: [
      { name: new RegExp(newSearch) }, 
      { subName: new RegExp(newSearch) }
    ]
  } : {};

  const data = await Food.find(keyword)
  .limit(limit)
  .skip((page - 1) * limit).exec();

  appSuccess({ res, data, message: '取得食品列表成功' });
});

// 取得一筆食品 API
exports.getOneFood = catchAsync(async (req, res, next) => {
  const foodId = req.params.foodId;

  const data = await Food.findById(foodId).exec();
  if (!data) return appError(apiState.DATA_NOT_FOUND, next);

  appSuccess({res, data, message: '取得一筆食品成功'});
});

// 新增一筆食品 API
// TODO: 缺少檢查每個成分的單位值是否正確
// TODO: 判斷食品重含量是否需要填寫單位克
exports.createOneFood = catchAsync(async (req, res, next) => {
  let { name, subName, brand, perUnitWeight, nutrition } = req.body;
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
  // 食品英文名稱2個字元以上(選填)
  if (subName && !validator.isLength(subName.trim(), {min:2})) {
    return appError({statusCode: 400, message:'食品英文名稱低於2個字元'}, next);
  };
  // 食品品牌名稱2個字元以上(選填)
  if (brand && !validator.isLength(brand.trim(), {min:2})) {
    return appError({statusCode: 400, message:'食品品牌名稱低於2個字元'}, next);
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

  const data = await Food.create({ name, subName, brand, perUnitWeight, nutrition });
  appSuccess({ res, data, message: '新增一筆食品成功' });
});

//TODO: 編輯一筆食品 API

//TODO: 刪除一筆食品 API