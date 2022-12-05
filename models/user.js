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
      enum: [0, 1],
      required: [true, '性別未填寫正確'],
      default: 1
    },
    birthday: {
      type: String,
      default: '2000-01-01'
    },
    height: {
      type: Number,
      default: 0
    },
    weight: {
      type: Number,
      default: 0
    },
    sportType: {
      type: String,
      enum: ['underSport', 'normalSport', 'moderateSport', 'severeSport', 'overSport'],
      default: 'underSport'
    },
    fitnessType: {
      type: String,
      enum: ['loseFat', 'gentleLoseFat', 'keepWeight', 'gentleAddFat', 'addFat'],
      default: 'keepWeight'
    },
    password: {
      type: String,
      required: [true, '密碼未填寫正確'],
      minlength: 8,
      select: false
    },
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
