// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

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

// use bodyparser
app.use(bodyParser.urlencoded({ extended: true }))

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
  const keyword = req.query.keyword

  Restaurant.find({ name: { $regex: keyword, $options: 'i' } })
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// add new restaurant
app.get('/add', (req, res) => {
  return res.render('add')
})

// add new restaurant
app.post('/add_restaurant', (req, res) => {
  const restaurant = req.body

  if ((restaurant.name.length === 0) || (restaurant.image.length === 0) ||
    (restaurant.location.length === 0) || (restaurant.phone.length === 0)) {
    return res.render('add', { restaurant })
  }
  else {
    return Restaurant.create(restaurant)
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  }
})

// delete selected restaurant
app.post('/restaurants/:id/delete', (req, res) => {
  // const id = req.params.id
  // return Todo.findById(id)
  //   .then(todo => todo.remove())
  //   .then(() => res.redirect('/'))
  //   .catch(error => console.log(error))
})

// start and listen on Express server
app.listen(port, () => {
  console.log(`Express is listen on localhost:${port}`)
})

