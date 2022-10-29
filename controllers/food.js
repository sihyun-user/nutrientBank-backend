const Food = require('../models/food');
const User = require('../models/user');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const catchAsync = require('../service/catchAsync');
const apiState = require('../service/apiState');
const appHelper = require('../service/appHelper');

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
exports.createOneFood = catchAsync(async (req, res, next) => {
  const { name, subName, brand, perUnitWeight, nutrition } = req.body;
  const paramData = { name, subName, brand, perUnitWeight, nutrition };

  appHelper.verifyFood(paramData, next);

  let data = await Food.create(paramData);
  data = { newFoodId: data._id };

  appSuccess({ res, data, message: '新增一筆食品成功' });
});

// 編輯一筆食品 API
exports.updateOneFood = catchAsync(async (req, res, next) => {
  let { name, subName, brand, perUnitWeight, nutrition } = req.body;
  const paramData = { name, subName, brand, perUnitWeight, nutrition };
  const foodId = req.params.foodId;

  appHelper.verifyFood(paramData, next);

  await Food.findByIdAndUpdate(foodId, paramData, {new: true, runValidators: true}).exec();
  appSuccess({ res, message: '編輯一筆食品成功' });
});

// 刪除一筆食品 API
exports.deleteOneFood = catchAsync(async (req, res, next) => {
  const foodId = req.params.foodId;

  const data = await Food.findByIdAndDelete(foodId).exec();
  if (!data) return appError(apiState.DATA_NOT_FOUND, next);

  appSuccess({ res, message: '刪除一筆食品成功' });
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
exports.getAllCustomFood = catchAsync(async (req, res, next) => {
});
//TODO: 新增自訂食品 API
exports.createCustomFood = catchAsync(async (req, res, next) => {
});
//TODO: 編輯自訂食品 API
exports.updateCustomFood = catchAsync(async (req, res, next) => {
});
//TODO: 刪除自訂食品 API
exports.deleteCustomFood = catchAsync(async (req, res, next) => {

});

//TODO: 新增一則食品日記 API
//TODO: 編輯一則食品日記 API
//TODO: 刪除一則食品日記 API