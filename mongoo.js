require('dotenv').config()
const mongoose = require('mongoose')

const password = process.env.DB_PASSWORD
const dbName = 'reviews'

const connectionString = `mongodb+srv://sospinai7:${password}@cluster0.jsf0goa.mongodb.net/${dbName}?retryWrites=true&w=majority`

// Connect to mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Connected to MongoDB')
  }).catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  })
