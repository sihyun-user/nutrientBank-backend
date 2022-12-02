const User = require('../models/user');
const Food = require('../models/food');
const CustomFood = require('../models/customFood');
const appSuccess = require('../service/appSuccess');
const appError = require('../service/appError');
const catchAsync = require('../service/catchAsync');

// 取得食品書籤列表 API
exports.getAllLike = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  // let data = await User.aggregate([
  //   { 
  //     $match: { _id : userId }
  //   },
  //   {
  //     $lookup: {
  //       from: 'foods',
  //       localField: 'food_likes',
  //       foreignField: '_id',
  //       as: 'food_likes'
  //     }
  //   },
  //   { 
  //     $lookup: {
  //       from: 'customfoods',
  //       localField: 'customFood_likes',
  //       foreignField: '_id',
  //       as: 'customFood_likes'
  //     }
  //   },
  //   { 
  //     $project: { 
  //       _id: 0, customFood_likes: 1, food_likes: 1
  //     } 
  //   }
  // ]);
  
  // let newData = data[0];
  // let new_food_likes = newData.food_likes.map(item => {
  //   item.id = item._id, delete item._id;
  //   return item;
  // });
  // let new_customFood_likes = newData.customFood_likes.map(item => {
  //   return {...item.food, id: item._id }
  // });
  // newData.food_likes = new_food_likes;
  // newData.customFood_likes = new_customFood_likes;
  let food_likes = await Food.find({
    likes: { $in: [userId] }
  }).select('-likes').exec();

  let customFood_likes = await CustomFood.find({
    likes: { $in: [userId] }
  }).exec();
  let new_customFood_likes = customFood_likes.map(item => {
    return {...item.food, id: item._id }
  });

  let data = { food_likes, customFood_likes: new_customFood_likes };

  appSuccess({ res, data, message: '取得食品書籤列表' });
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
    $addToSet: { likes: userId }
  },{new: true, runValidators: true}).exec();
  if (!data) return appError({statusCode: 400, message:`${foodType}資料不存在`}, next);

  appSuccess({ res, message: '取消食品書籤成功' });
});