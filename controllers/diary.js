const Food = require('../models/food');
const CustomFood = require('../models/customFood');
const Diary = require('../models/diary');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const catchAsync = require('../service/catchAsync');
const apiState = require('../service/apiState');
const moment = require('moment');

const mealType = ['breakfast', 'lunch', 'dinner', 'dessert'];

const getRangeDate = (entry_date) => {
  const date = entry_date ? moment(entry_date) : moment();
  const startDate = new Date(date.utc().startOf('month').format());
  const endDate = new Date(date.utc().endOf('month').format());
  return { startDate, endDate };
}

// 取得營養日記列表 API
//!TODO: 食品已被刪除話
exports.getDiarys = catchAsync(async(req, res, next) => {
  const entry_date = req.query.entry_date;
  const userId = req.userId;

  const { startDate, endDate }  = getRangeDate(entry_date);
  const createdAt =  { $gte: startDate, $lt: endDate };

  let data = await Diary.aggregate([
    { 
      $match: { user : userId, createdAt }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $lookup: {
        from: 'foods',
        localField: 'food',
        foreignField: '_id',
        as: 'food_doc'
      }
    },
    { 
      $lookup: {
        from: 'customfoods',
        localField: 'customFood',
        foreignField: '_id',
        as: 'customFood_doc'
      }
    },
    {
      $unwind: { path: '$food_doc', preserveNullAndEmptyArrays: true } 
    },
    { 
      $unwind: { path: '$customFood_doc', preserveNullAndEmptyArrays: true } 
    },
    { 
      $project: { 
        _id: 0, diaryId: '$_id', date: 1, meal: 1, quantity: 1, type: 1, food_doc: 1, customFood_doc: 1,
        date: '$createdAt'
      } 
    }
  ]);

  data.forEach((item) => {
    if (item.type=='food') {
      item.food = item.food_doc;
      item.food.id = item.food._id;
      delete item.food_doc;
      delete item.food._id;
    } else {
      item.food = item.customFood_doc.food;
      item.food.id = item.customFood_doc._id;
      delete item.customFood_doc;
    }
    item.date = moment(item.date).format('YYYY-MM-DD')
  });

  appSuccess({res, data, message: '取得今月營養日記列表成功'});
});

// 新增一則營養日記 API
//!TODO: 新增日期
exports.createOneDiary = catchAsync(async(req, res, next) => {
  const { quantity, meal, type } = req.body;
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
  // 食品類型正確
  if (type !== 'food' && type !== 'customFood') {
    return appError({statusCode: 400, message:'食品類型未填寫正確'}, next);
  };
  // 檢查是否自訂食品
  let food_data;
  if (type=='food') {
    food_data = await Food.findById(foodId).exec();
    if (!food_data) return appError({statusCode: 400, message:'食品資料不存在'}, next);
  } else {
    food_data = await CustomFood.findById(foodId).exec();
    if (!food_data) return appError({statusCode: 400, message:'自訂食品資料不存在'}, next);
    food_data = food_data.food;
  };
  const paramData = {
    meal,
    user: userId,
    quantity,
    type
  };
  foodType = type=='food' ? 'food' : 'customFood'
  paramData[foodType] = foodId;

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