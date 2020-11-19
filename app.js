// 1.載入
// 載入 express 並建構應用程式伺服器
const express = require('express')
const app = express()
// 載入 mongoose
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
// 載入 Restaurant model
const Restaurant = require('./models/restaurant')
// 引用 body-parser
const bodyParser = require('body-parser')
// 載入 method-override
const methodOverride = require('method-override')

// 2.設定連線到 mongoDB
mongoose.connect('mongodb://localhost/restaurant-list-CRUD', { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// 3.模板引擎,body-parser
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

// 4.設定路由
// 設定首頁路由
app.get('/', (req, res) => {
  Restaurant.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants: restaurants })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

// 設定搜尋路由
app.get('/search', (req, res) => {
  console.log('req.query', req.query)
  const keyword = req.query.keyword
  Restaurant.find({ name: { $regex: `${keyword}`, $options: 'i' } }) // 取出符合搜尋的資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants: restaurants, keyword: keyword })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

// 設定新增頁面路由
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

// 設定新增路由接住表單資料
app.post('/restaurants', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({ name: name, name_en: name_en, category: category, image: image, location: location, phone: phone, google_map: google_map, rating: rating, description: description }) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// 設定特定詳情的路由
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

// 設定編輯頁面的路由
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

// 設定新增路由接住修改的表單資料
app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// 設定新增路由接住刪除的表單資料
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// 5.設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
