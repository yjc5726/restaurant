const Restaurant = require('../restaurant') // 載入 todo model
const db = require('../../config/mongoose')
const restList = require('../../restaurant.json')

db.once('open', () => {
  for (let i = 0; i < restList.results.length; i++) {
    Restaurant.create(restList.results[i])
  }
  console.log('done')
})
