require('dotenv').config()
const mongoose = require('mongoose')

const connectionString = process.env.MONGO_URL

console.log(connectionString)

// Connect to mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB')
  }).catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  })
