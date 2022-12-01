const CustomFood = require('../models/customFood');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const catchAsync = require('../service/catchAsync');
const apiState = require('../service/apiState');
const appHelper = require('../service/appHelper');

// 取得自訂食品列表 API
exports.getAllCustomFood = catchAsync(async (req, res, next) => {
  let { search, page = 1, limit = 10 } = req.query;
  const userId = req.userId;

  let newSearch = search !== undefined ? search.trim() : '';
  let keyword = search !== undefined ? {
    $or: [
      { "food.name": new RegExp(newSearch), }, 
      { "food.subName": new RegExp(newSearch) }
    ]
  } : {};

  let data = await CustomFood.find({ user: userId , ...keyword })
  .limit(limit)
  .skip((page - 1) * limit).exec();
  if (!data) return appError(apiState.DATA_NOT_FOUND, next);

  let newData = data.map(item => {
    return { ...item.food, id: item.id }
  });

  appSuccess({ res, data: newData ,message: '取得自訂食品列表' });
});

// 新增自訂食品 API
exports.createCustomFood = catchAsync(async (req, res, next) => {
  const { name, subName, brand, perUnitWeight, unit, nutrition } = req.body;
  const paramData = { name, subName, brand, perUnitWeight, unit, nutrition, type:'customFood' };
  const userId = req.userId;

  appHelper.verifyFood(paramData, next);

  let data = await CustomFood.create({
    user: userId,
    food: paramData
  });
  data = { newCustomFoodId: data._id }

  appSuccess({ res, data, message: '新增一筆自訂食品成功' });
});

// 編輯自訂食品 API
exports.updateCustomFood = catchAsync(async (req, res, next) => {
  let { name, subName, brand, perUnitWeight, unit, nutrition } = req.body;
  const paramData = { name, subName, brand, perUnitWeight, unit, nutrition, type:'customFood' };
  const userId = req.userId;
  const customFoodId = req.params.customFoodId;

  appHelper.verifyFood(paramData, next);

  const data = await CustomFood.findOneAndUpdate({
    _id: customFoodId,
    user: userId
  }, { food: paramData }, {new: true, runValidators: true}).exec();
  if (!data) return appError(apiState.DATA_NOT_FOUND, next);

  appSuccess({ res, data, message: '編輯一筆自訂食品成功' })
});

// 刪除自訂食品 API
exports.deleteCustomFood = catchAsync(async (req, res, next) => {
  const customFoodId = req.params.customFoodId;
  const userId = req.userId;

  const data = await CustomFood.findOneAndDelete({
    _id: customFoodId,
    user: userId
  }).exec();
  if (!data) return appError(apiState.DATA_NOT_FOUND, next);

  appSuccess({ res, message: '刪除一筆自訂食品成功' });
});