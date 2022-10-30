const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diary');
const { isAuth } = require('../service/appHelper');

router
  .get('/diarys', isAuth,
    /*
      #swagger.tags= ['Diary - 營養日記']
      #swagger.description = '取得今月營養日記 API'
      #swagger.responses[200] = { 
        description: '營養資訊',
        schema: { 
          status: true,
          message: '取得今月營養日記成功',
        }
      }
    */
    diaryController.getMonthDiary
  )
  .post('/diary', isAuth,
    /*
      #swagger.tags= ['Diary - 營養日記']
      #swagger.description = '新增一筆營養日記 API'
      #swagger.responses[200] = { 
        description: '營養資訊',
        schema: { 
          status: true,
          message: '新增一筆營養日記成功',
        }
      }
    */
    diaryController.createOneDiary
  )
  .patch('/diary/:diaryId', isAuth,
    /*
      #swagger.tags= ['Diary - 營養日記']
      #swagger.description = '編輯一筆營養日記 API'
      #swagger.responses[200] = { 
        description: '營養資訊',
        schema: { 
          status: true,
          message: '編輯一筆營養日記成功',
        }
      }
    */
    diaryController.updateOneDiary
  )
  .delete('/diary/:diaryId', isAuth,
    /*
      #swagger.tags= ['Diary - 營養日記']
      #swagger.description = '刪除一筆營養日記 API'
      #swagger.responses[200] = { 
        description: '營養資訊',
        schema: { 
          status: true,
          message: '刪除一筆營養日記成功',
        }
      }
    */
    diaryController.deleteOneDiary
  )

module.exports = router;