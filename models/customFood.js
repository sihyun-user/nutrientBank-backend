const mongoose = require('mongoose');

const customFood = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
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
        type: Number,
        default: 0,
        required: [true, '食品每一份量含未填寫正確']
      },
      unit: {
        type: String,
        default: 'g',
        enum: ['g', 'ml'],
        required: [true, '食品每一份量含單位未填寫正確']
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
        default: 'customFood',
        required: [true, '食品類型未填寫正確']
      },
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      }
    },
    type: {
      type: String,
      default: 'customFood',
      required: [true, '食品類型未填寫正確']
    },
    likes: [
      { 
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
  },
  {
    versionKey: false
  }
);

const CustomFood = mongoose.model('Customfood', customFood);

customFood.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = CustomFood;