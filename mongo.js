require('dotenv').config()
const mongoose = require('mongoose')

const connectionString = process.env.MONGO_URL

// Connect to mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB')
  }).catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  })
