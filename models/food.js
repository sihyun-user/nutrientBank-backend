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
    nutrition: {
      type: Object,
      calories: 0,
      carbohydrates: 0,
      protein: 0,
      fat: 0,
      saturated_fat: 0,
      trans_fat: 0,
      sodium: 0,
      sugar: 0,
      required: [true, '食品營養成分未填寫正確']
    },
    type: {
      type: String,
      default: 'food',
      required: [true, '食品類型未填寫正確']
    },
    likes: [
      { 
        type: mongoose.Schema.ObjectId,
        ref: 'User'
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

foodSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = Food;