const express = require('express');
const router = express.Router();
const customFoodController = require('../controllers/customFood');
const { isAuth } = require('../service/appHelper');

router
  .get('/customFoods', isAuth,
    /*
      #swagger.tags= ['customFood - 自訂食品']
      #swagger.description = '取得自訂食品列表 API'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.parameters['search'] = {
        in: 'query',
        type: 'String',
        description: '關鍵字搜尋(中、英文名稱搜尋)',
      }
      #swagger.parameters['page'] = {
        in: 'query',
        type: 'String',
        description: '頁數搜尋',
      }
      #swagger.parameters['limit'] = {
        in: 'query',
        type: 'String',
        description: '撈取資料筆數',
      }
      #swagger.responses[200] = { 
        description: '自訂食品資訊',
        schema: { $ref: '#/definitions/getAllCustomFood' }
      }
    */
    customFoodController.getAllCustomFood
  )
  .post('/customFood', isAuth,
    /*
      #swagger.tags = ['customFood - 自訂食品']
      #swagger.description = '新增一筆自訂食品 API'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: true,
        description: '資料格式',
        schema: { 
          $name: '食品名稱',
          subName: '食品英文名稱',
          brand: '食品品牌',
          $perUnitWeight: '食品重含量',
          $unit: '食品重含量單位',
          $nutrition: {
            calories: '卡路里含量',
            carbohydrates: '碳水化合物含量',
            protein: '蛋白質含量',
            fat: '脂肪含量',
            saturated_fat: '飽和脂肪含量',
            trans_fat: '反式脂肪含量',
            sodium: '納含量',
            sugar: '糖含量',
          }
        }
      }
      #swagger.responses[200] = { 
        description: '自訂食品資訊',
        schema: {
          status: true,
          message: '新增一筆自訂食品成功',
          data: {
            newCustomFoodId: '自訂食品Id'
          }
        }
      }
    */
    customFoodController.createCustomFood
  )
  .patch('/customFood/:customFoodId', isAuth,
    /*
      #swagger.tags = ['customFood - 自訂食品']
      #swagger.description = '編輯一筆自訂食品 API'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: true,
        description: '資料格式',
        schema: { 
          $name: '食品名稱',
          subName: '食品英文名稱',
          brand: '食品品牌',
          $perUnitWeight: '食品重含量',
          $unit: '食品重含量單位',
          $nutrition: {
            calories: '卡路里含量',
            carbohydrates: '碳水化合物含量',
            protein: '蛋白質含量',
            fat: '脂肪含量',
            saturated_fat: '飽和脂肪含量',
            trans_fat: '反式脂肪含量',
            sodium: '納含量',
            sugar: '糖含量',
          }
        }
      }
      #swagger.responses[200] = { 
        description: '自訂食品資訊',
        schema: {
          status: true,
          message: '編輯一筆自訂食品成功'
        }
      }
    */
    customFoodController.updateCustomFood
  )
  .delete('/customFood/:customFoodId', isAuth,
    /*
      #swagger.tags = ['customFood - 自訂食品']
      #swagger.description = '刪除自訂食品 API'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.responses[200] = { 
        description: '自訂食品資訊',
        schema: { 
          status: true,
          message: '刪除一筆自訂食品成功'
        }
      }
    */
    customFoodController.deleteCustomFood
  );

module.exports = router;