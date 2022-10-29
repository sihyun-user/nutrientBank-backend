const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '用戶Id未填寫正確']
    },
    food: {
      type: mongoose.Schema.ObjectId,
      ref: 'Food',
      required: [true, '食品Id未填寫正確']
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