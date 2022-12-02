const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like');
const { isAuth } = require('../service/appHelper');

router
  .get('/likes', isAuth,
    /*
      #swagger.tags = ['Like - 書籤']
      #swagger.description = '取得食品書籤列表 API'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.responses[200] = { 
        description: '食品書籤資訊',
        schema: { 
          status: true,
          message: '取得食品書籤列表成功'
        }
      }
    */
    likeController.getAllLike
  )
  .post('/like/:foodId', isAuth,
    /*
      #swagger.tags = ['Like - 書籤']
      #swagger.description = '新增食品書籤 API'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.responses[200] = { 
        description: '食品書籤資訊',
        schema: { 
          status: true,
          message: '新增食品書籤成功'
        }
      }
    */
    likeController.addFoodLike
  )
  .post('/unlike/:foodId', isAuth,
    /*
      #swagger.tags = ['Like - 書籤']
      #swagger.description = '取消食品書籤 API'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.responses[200] = { 
        description: '食品書籤資訊',
        schema: { 
          status: true,
          message: '取消食品書籤成功'
        }
      }
    */
    likeController.cancelFoodLike
  );

module.exports = router;