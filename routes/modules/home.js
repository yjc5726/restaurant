// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 載入 Restaurant model
const Restaurant = require('../../models/restaurant')
// 設定首頁路由
router.get('/', (req, res) => {
  Restaurant.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants: restaurants })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})
// 設定搜尋路由
router.get('/search', (req, res) => {
  console.log('req.query', req.query)
  const keyword = req.query.keyword
  Restaurant.find({ name: { $regex: `${keyword}`, $options: 'i' } }) // 取出符合搜尋的資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants: restaurants, keyword: keyword })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

// 匯出路由模組
module.exports = router
