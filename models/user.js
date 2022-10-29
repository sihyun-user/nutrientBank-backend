const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '用戶名稱未填寫正確']
    },
    email: {
      type: String,
      required: [true, 'email未填寫正確'],
      unique: true,
      lowercase: true
    },
    photo: {
      type: String,
      default: ''
    },
    sex: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: '性別未填寫正確(male、female)',
      },
      default: 'male'
    },
    password: {
      type: String,
      required: [true, '密碼未填寫正確'],
      minlength: 8,
      select: false
    },
    likes: [
      { type: mongoose.Schema.ObjectId, ref: 'Food' }
    ],
    isAdmin: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
  },
  {
    versionKey: false
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
