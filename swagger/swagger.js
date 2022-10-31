const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: '營養日記 API', // 文件名稱
    description: '營養日記文件' // 文件描述
  },
  host: 'localhost:3005', // (重要) 本地:localhost:3005 | render:nutrientbank-app-backend.onrender.com
	basePath: '', // 預設為'/'
  schemes: ['http', 'https'], // swagger文件支援哪幾種模式
	securityDefinitions: { // 驗證 token
    api_key: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: '請加上 API Token'
    }
  },
	definitions: { // 用法: $ref: '#/definitions/getAllFood'
    login: {
      status: true,
      nessage: '登入成功',
      data: {
        user: {
          _id: '會員Id',
          name: '會員名稱',
          email: '會員E-mail',
          photo: '頭貼網址',
          sex: '[male、female]'
        },
        token: 'Bearer token'
      }
    },
    getProfile: {
      status: true,
      message: '取得會員資料成功',
      data: {
        name: '會員名稱',
        email: '會員E-mail',
        photo: '頭貼網址',
        sex: '[male、female]'
      }
    },
    updateProfile: {
      status: true,
      message: '編輯會員資料成功',
      data: {
        name: '會員名稱',
        email: '會員E-mail',
        photo: '頭貼網址',
        sex: '[male、female]'
      }
    },
		getAllFood: {
      status: true,
      message: '取得食品列表成功',
      data: [{
        _id: '食品Id',
        name: '食品名稱',
        subName: '食品英文名稱',
        brand: '食品品牌',
        perUnitWeight: '食品重含量',
        nutrition:[
          {
            ingredient: "食品營養成分",
            unit: "食品營養成分單位",
            perUnitContent:" 每單位重含量"
          }
        ]
      }]
    },
    getOneFood: {
      status: true,
      message: '取得一筆食品成功',
      data: [{
        _id: '食品Id',
        name: '食品名稱',
        subName: '食品英文名稱',
        brand: '食品品牌',
        perUnitWeight: '食品重含量',
        nutrition:[
          {
            ingredient: "食品營養成分",
            unit: "食品營養成分單位",
            perUnitContent:" 每單位重含量"
          }
        ]
      }]
    },
    getAllCustomFood: {
      status: true,
      message: '取得自訂食品列表成功',
      data: [{
        _id: '自訂食品Id',
        name: '食品名稱',
        subName: '食品英文名稱',
        brand: '食品品牌',
        perUnitWeight: '食品重含量',
        nutrition:[
          {
            ingredient: "食品營養成分",
            unit: "食品營養成分單位",
            perUnitContent:" 每單位重含量"
          }
        ]
      }]
    },
    getMonthdiarys: {
      breakfast: [
        {
          food: {
            _id: '食品Id',
            name: '食品名稱',
            subName: '食品英文名稱',
            brand: '食品品牌',
            perUnitWeight: '食品重含量',
            nutrition:[
              {
                ingredient: "食品營養成分",
                unit: "食品營養成分單位",
                perUnitContent:" 每單位重含量"
              }
            ]
          },
          meal: '餐別類型(breakfast、lunch、dinner、dessert)',
          createdAt: '建立時間'
        }
      ],
      lunch: [
        {
          food: {
            _id: '食品Id',
            name: '食品名稱',
            subName: '食品英文名稱',
            brand: '食品品牌',
            perUnitWeight: '食品重含量',
            nutrition:[
              {
                ingredient: "食品營養成分",
                unit: "食品營養成分單位",
                perUnitContent:" 每單位重含量"
              }
            ]
          },
          meal: '餐別類型(breakfast、lunch、dinner、dessert)',
          createdAt: '建立時間'
        }
      ],
      dinner: [
        {
          food: {
            _id: '食品Id',
            name: '食品名稱',
            subName: '食品英文名稱',
            brand: '食品品牌',
            perUnitWeight: '食品重含量',
            nutrition:[
              {
                ingredient: "食品營養成分",
                unit: "食品營養成分單位",
                perUnitContent:" 每單位重含量"
              }
            ]
          },
          meal: '餐別類型(breakfast、lunch、dinner、dessert)',
          createdAt: '建立時間'
        }
      ],
      dessert: [
        {
          food: {
            _id: '食品Id',
            name: '食品名稱',
            subName: '食品英文名稱',
            brand: '食品品牌',
            perUnitWeight: '食品重含量',
            nutrition:[
              {
                ingredient: "食品營養成分",
                unit: "食品營養成分單位",
                perUnitContent:" 每單位重含量"
              }
            ]
          },
          meal: '餐別類型(breakfast、lunch、dinner、dessert)',
          createdAt: '建立時間'
        }
      ]
    }
	}
};

const outputFile = './swagger/swagger-output.json'; // 輸出的文件名稱(swagger json文件)
const endpointsFiles = ['./app.js'] // 讀取的檔案(進入點)

swaggerAutogen(outputFile, endpointsFiles , doc);