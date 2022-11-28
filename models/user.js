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
      type: Number,
      enum: {
        values: [0, 1],
        message: '性別未填寫正確(男 1、女 0)',
      },
      default: 1
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

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = User;
