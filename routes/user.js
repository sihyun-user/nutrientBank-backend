const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { isAuth } = require('../service/appHelper');

router.post('/user/signup', 
  /*
    #swagger.tags = ['User - 會員']
    #swagger.description = '會員註冊 API'
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: '資料格式',
      schema: {
        $name: 'user001',
        $email: 'user001@gmail.com',
        $password: 'user123456',
        $confirmPassword: 'user123456',
      }
    }
    #swagger.response[200] = {
      description: '會員註冊資訊',
      schema: {
        status: true,
        message: '註冊成功，請重新登入'
      }
    }
  */
  userController.signup
);

router.post('/user/login', 
  /*
    #swagger.tags = ['User - 會員']
    #swagger.description = '會員登入 API'
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: '資料格式',
      schema: {
        $email: 'user001@gmail.com',
        $password: 'user123456'
      }
    }
    #swagger.response[200] = {
      description: '會員登入資訊',
      schema: { $ref: '#/definitions/login'}
    }
  */
  userController.login
);

router
  .get('/user/profile', isAuth,
    /*
      #swagger.tags = ['User - 會員']
      #swagger.description = '取得會員資料 API'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.responses[200] = { 
        description: '會員資料資訊',
        schema: { $ref: '#/definitions/getProfile' }
      }
    */
    userController.getProfile
  )
  .patch('/user/profile', isAuth,
    /*
      #swagger.tags = ['User - 會員']
      #swagger.description = '編輯會員資料 API'
      #swagger.security = [{'api_key': ['apiKeyAuth']}]
      #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: true,
        description: '資料格式',
        schema: {
          $name: '',
          $sex: '',
          photo: ''
        }
      }
      #swagger.response[200] = {
        description: '會員資料資訊',
        schema: { $ref: '#/definitions/updateProfile' }
      }
    */
    userController.updateProfile  
  );

router.post('/user/updatePassword', isAuth,
  /*
    #swagger.tags = ['User - 會員']
    #swagger.description = '編輯密碼 API'
    #swagger.security = [{'api_key': ['apiKeyAuth']}]
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: true,
      description: '資料格式',
      schema: { 
        $password: '',
        $confirmPassword: '',
      }
    }
    #swagger.responses[200] = { 
      description: '編輯密碼資訊',
      schema: { 
        status: true,
        message: '編輯密碼成功'
      }
    }
  */
  userController.updatePassword
);

module.exports = router;