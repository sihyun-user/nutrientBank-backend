const Food = require('../models/food');
const CustomFood = require('../models/customFood');
const Diary = require('../models/diary');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const catchAsync = require('../service/catchAsync');
const apiState = require('../service/apiState');

const mealType = ['breakfast', 'lunch', 'dinner', 'dessert'];

// 取得營養日記列表 API
exports.getDiarys = catchAsync(async(req, res, next) => {
  const entry_date = req.query.entry_date;
  const userId = req.userId;

  const date = entry_date ? new Date(entry_date) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const startDate = new Date(new Date(`${year}-${month}-1`).setHours(00, 00, 00));
  const endDate = new Date(new Date(`${year}-${month}-31`).setHours(23, 59, 59));

  const data = await Diary.aggregate([
    { 
      $match: { 
        user : userId,
        createdAt: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: { 
        _id: { 
          diaryId: "$_id", meal: '$meal', food: '$food', quantity: '$quantity', 
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } 
        }
      }
    },
    { 
      $project: { _id: 0, diaryId: '$_id.diaryId', date: '$_id.date', meal: '$_id.meal', quantity: '$_id.quantity', food: '$_id.food' } 
    },
    { 
      $unset: ['food._id']
    }
  ]);

  appSuccess({res, data, message: '取得今月營養日記列表成功'});
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

// 刪除一筆營養日記 API
exports.deleteOneDiary = catchAsync(async(req, res, next) => {
  const diaryId = req.params.diaryId;
  const userId = req.userId;
  
  const data = await Diary.findOneAndDelete({
    _id: diaryId,
    user: userId
  }).exec();
  if (!data) return appError(apiState.DATA_NOT_FOUND, next);

  appSuccess({ res, message: '刪除一筆營養日記成功'});
});