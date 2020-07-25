// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const app = express()

const port = 3000

// require express-handlebars here
const exphbs = require('express-handlebars')

// const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// setting mongoose connection
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// get mongo db connection
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})

// routes setting
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// show selected restaurant info
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id

  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

// query restaurant
app.get('/search', (req, res) => {
  // const keyword = req.query.keyword
  // const search_restaurants = restaurantList.results.filter(restaurant => {
  //   return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  // })
  // res.render('index', { restaurants: search_restaurants, keyword: keyword })
})

// start and listen on Express server
app.listen(port, () => {
  console.log(`Express is listen on localhost:${port}`)
})

