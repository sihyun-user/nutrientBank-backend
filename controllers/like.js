const User = require('../models/user');
const Food = require('../models/food');
const CustomFood = require('../models/customFood');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const catchAsync = require('../service/catchAsync');

// 取得食品書籤列表 API
exports.getAllLike = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const search = req.query.search;

  const newSearch = search !== undefined ? search.trim() : '';
  const keyword = search !== undefined ? { 
    $or: [
      { name: new RegExp(newSearch) }, 
      { subName: new RegExp(newSearch) }
    ]
  } : {};
  const likes = { likes: { $in: [userId] } };
  const payload = { ...keyword, ...likes };

  const customFood_list = await CustomFood.find(payload)
  const customFood_count = customFood_list.length;
  const new_customFood_list = customFood_list.map(item => {
    return {...item.food, likes: item.likes, id: item._id }
  });

  const food_list = await Food.find(payload)
  const food_count = food_list.length;

  const data = { 
    count: food_count + customFood_count,
    list: [...new_customFood_list, ...food_list]
  };

  appSuccess({ res, data, message: '取得食品書籤列表' });
});

// 取得一筆食品書籤 API
exports.getOneLike = catchAsync(async (req, res, next) => {
  const foodId = req.params.foodId;
  const type = req.query.type;

  let modelType = type=='food' ? Food : CustomFood;
  let foodType = type=='food' ? '食品' : '自訂食品';
  const data = await modelType.findById(foodId).exec();
  if (!data) return appError({statusCode: 400, message:`${foodType}資料不存在`}, next);

  appSuccess({ res, data, message: '取得一筆食品書籤成功' });
});

// 新增食品書籤 API
exports.addFoodLike = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const foodId = req.params.foodId;
  const type = req.query.type;

  let modelType = type=='food' ? Food : CustomFood;
  let foodType = type=='food' ? '食品' : '自訂食品';
  const data = await modelType.findOneAndUpdate({ _id: foodId }, {
    $addToSet: { likes: userId }
  },{new: true, runValidators: true}).exec();
  if (!data) return appError({statusCode: 400, message:`${foodType}資料不存在`}, next);
  if (type=='customFood' && data.user.toString()!==userId.toString()) {
    return appError({statusCode: 400, message:'非本人自訂食品，不能新增書籤'}, next); 
  };

  appSuccess({ res, message: '新增食品書籤成功' });
});

// 取消食品書籤 API
exports.cancelFoodLike = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const foodId = req.params.foodId;
  const type = req.query.type;

  let modelType = type=='food' ? Food : CustomFood;
  let foodType = type=='food' ? '食品' : '自訂食品';
  const data = await modelType.findOneAndUpdate({ _id: foodId }, {
    $pull: { likes: userId }
  },{new: true, runValidators: true}).exec();
  if (!data) return appError({statusCode: 400, message:`${foodType}資料不存在`}, next);

  appSuccess({ res, message: '取消食品書籤成功' });
});