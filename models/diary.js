const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '用戶Id未填寫正確']
    },
    food: {
      type: Object,
      required: [true, '食品未填寫正確']
    },
    quantity: {
      type: Number,
      required: [true, '份量未填寫正確'],
      defaule: 1
    },
    meal: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'dessert'],
      defaule: 'breakfast',
      required: [true, '餐別類型未填寫正確']
    },
    isCustom: {
      type: Boolean,
      defaule: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

const Diary = mongoose.model('Diary', diarySchema);

module.exports = Diary;