const User = require('../models/user');
const Food = require('../models/food');
const CustomFood = require('../models/customFood');
const Diary = require('../models/diary');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const catchAsync = require('../service/catchAsync');
const apiState = require('../service/apiState');

const mealType = ['breakfast', 'lunch', 'dinner', 'dessert'];

// 取得今月營養日記列表 API
exports.getMonthDiary = catchAsync(async(req, res, next) => {
  const { year, month } = req.params; 
  const userId = req.userId;
  // 參數資料正確
  if ((!year || !month)) {
    return appError({statusCode: 400, message:'年、月份參數未填寫正確'}, next);
  };

  const startDate = new Date(`${year}-${month}-1`);
  const endDate = new Date(`${year}-${month}-31`);
  const createdAt = {
    createdAt: {
      $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
      $lt: new Date(new Date(endDate).setHours(23, 59, 59))
    }
  };
  const data = await Diary.find({ user: userId, ...createdAt }).select('-_id -user');
  if(!data) return appError(apiState.DATA_NOT_FOUND);

  let newData = {};
  mealType.forEach((el) => newData[el] = data.filter(item => el == item.meal));
  
  appSuccess({res, data: newData, message: '取得今月營養日記列表成功'});
});
// 新增一則營養日記 API
exports.createOneDiary = catchAsync(async(req, res, next) => {
  const { quantity, meal, isCustom } = req.body;
  const foodId = req.params.foodId;
  const userId = req.userId;
  // 資料欄位正確
  if (!quantity || !meal) {
    return appError(apiState.DATA_MISSING, next);
  };
  // 餐別類型正確
  if (!mealType.includes(meal)) {
    return appError({statusCode: 400, message:'餐別類型未填寫正確(breakfast、lunch、dinner、dessert)'}, next);
  };
  // 檢查是否自訂食品
  let foodData, customFoodData;
  if (!isCustom) {
    foodData = await Food.findById(foodId).exec();
    if (!foodData) return appError({statusCode: 400, message:'食品資料不存在'}, next);
  } else {
    customFoodData = await CustomFood.findById(foodId).exec();
    if (!customFoodData) return appError({statusCode: 400, message:'自訂食品資料不存在'}, next);
    customFoodData = customFoodData.food;
  };
  const paramData = {
    meal,
    user: userId,
    quantity,
    food:  foodData ? foodData : customFoodData
  };
  const data = await Diary.create(paramData);
  newData = { newDiaryId: data._id };

  appSuccess({res, data: newData, message: '新增一則營養日記成功'});
});
// 編輯一筆營養日記 API
exports.updateOneDiary = catchAsync(async(req, res, next) => {
  const { quantity, meal } = req.body;
  const diaryId = req.params.diaryId;
  const userId = req.userId;
  // 資料欄位正確
  if (!quantity || !meal) {
    return appError(apiState.DATA_MISSING, next);
  };
  // 餐別類型正確
  if (!mealType.includes(meal)) {
    return appError({statusCode: 400, message:'餐別類型未填寫正確(breakfast、lunch、dinner、dessert)'}, next);
  };

  const data = await Diary.findOneAndUpdate({
    _id: diaryId,
    user: userId
  }, { meal, quantity }, {new: true, runValidators: true}).exec();
  if (!data) return appError(apiState.DATA_NOT_FOUND, next);

  appSuccess({ res, message: '編輯一筆營養日記成功'});
});
//TODO: 刪除一則營養日記 API
exports.deleteOneDiary = catchAsync(async(req, res, next) => {

});