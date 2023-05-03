require('dotenv').config()
const mongoose = require('mongoose')

// Get the env variables that we need
const { MONGO_URL, MONGO_URL_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test' ? MONGO_URL_TEST : MONGO_URL

// Connect to mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB')
  }).catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  })

process.on('uncaughtException', (error) => {
  console.log('uncaughtException', error.message)
  mongoose.disconnect()
})
