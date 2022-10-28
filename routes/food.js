const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food');

router.get('/foods', 
  /*
    #swagger.tags= ['Food - 食品']
    #swagger.description = '取得食品列表 API'
    #swagger.parameters['search'] = {
      in: 'query',
      type: 'String',
      description: '關鍵字搜尋(中、英文名稱搜尋)',
    }
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'Number',
      description: '頁數搜尋',
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      type: 'Number',
      description: '撈取資料筆數',
    }
    #swagger.responses[200] = { 
      description: '食品資訊',
      schema: { $ref: '#/definitions/getAllFood' }
    }
  */
  foodController.getAllFood
);

router
  .get('/food/:foodId',
    /*
      #swagger.tags= ['Food - 食品']
      #swagger.description = '取得一筆食品 API'
      #swagger.responses[200] = { 
        description: '食品資訊',
        schema: { $ref: '#/definitions/getOneFood' }
      }
    */
    foodController.getOneFood
  )
  .post('/food',
    /*
      #swagger.tags = ['Food - 食品']
      #swagger.description = '新增一筆食品 API'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: true,
        description: '資料格式',
        schema: { 
          $content: '食品名稱',
          subName: '食品英文名稱',
          brand: '食品品牌',
          $perUnitWeight: '食品重含量',
          $nutrition:[
            {
              ingredient: "食品營養成分",
              unit: "食品營養成分單位",
              perUnitContent: "每單位重含量"
            }
          ]
        }
      }
      #swagger.responses[200] = { 
        description: '貼文資訊',
        schema: {
          status: true,
          message: '新增一筆食品成功'
        }
      }
    */
    foodController.createOneFood
  );

module.exports = router;
