const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
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
      type: Number,
      default: 0,
      required: [true, '食品重含量未填寫正確']
    },
    unit: {
      type: String,
      default: '克',
      enum: ['克', '毫升'],
      required: [true, '食品重含量單位未填寫正確']
    },
    nutrition: [
      {
        _id: false,
        ingredient: {
          type: String,
          default: '糖',
          enum: ['糖','碳水化合物', '反式脂肪', '熱量', '脂肪', '蛋白質', '鈉', '飽和脂肪'],
        },
        perUnitContent: {
          type: Number,
          default: 0
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  },
  {
    versionKey: false
  }
);

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;