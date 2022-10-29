const mongoose = require('mongoose');

const customFood = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '用戶Id未填寫正確']
    },
    food: {
      name: {
        type: String,
        required: [true, '食品名稱未填寫正確']
      },
      subName: {
        type: String,
        default: ''
      },
      brand: {
        type: String,
        default: ''
      },
      perUnitWeight: {
        type: String,
        default: '0.0克'
      },
      nutrition: [
        {
          _id: false,
          ingredient: {
            type: String,
            default: '糖',
            enum: ['糖','碳水化合物', '反式脂肪', '熱量', '脂肪', '蛋白質', '鈉', '飽和脂肪'],
          },
          unit: {
            type: String,
            default: 'g',
            enum: ['g', 'mg', 'ml', 'kcal'],
            required: [true, '食品營養成分單位未填寫正確']
          },
          perUnitContent: {
            type: String,
            default: ''
          }
        }
      ],
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      }
    }
  },
  {
    versionKey: false
  }
);

const CustomFood = mongoose.model('CustomFood', customFood);

module.exports = CustomFood;