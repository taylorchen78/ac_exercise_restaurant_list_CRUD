// require packages
const mongoose = require('mongoose')
const Restaurant = require('../restaurant')

const restaurantList = require('../../restaurant.json')

// setting mongoose connection
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// get mongo db connection
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')

  restaurantList.results.forEach(element => {
    Restaurant.create({
      name: element.name, name_en: element.name_en, category: element.category,
      image: element.image, location: element.location, phone: element.phone,
      google_map: element.google_map, rating: element.rating, description: element.description
    })
  });

  console.log('done')
})
