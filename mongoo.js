require('dotenv').config()
const mongoose = require('mongoose')
const { model, Schema } = mongoose

const password = process.env.DB_PASSWORD
const dbName = 'reviews'

const connectionString = `mongodb+srv://sospinai7:${password}@cluster0.jsf0goa.mongodb.net/${dbName}?retryWrites=true&w=majority`

// Connect to mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB')
  }).catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  })

// Define a schema
const noteSchema = new Schema({
  title: String,
  content: String,
  date: Date,
  important: Boolean
})

// Define a model to create reviews
const Review = model('Review', noteSchema)

// create a new Review
const review = new Review({
  title: 'Review 1',
  content: 'This is the content of the review',
  date: new Date(),
  important: true
})

review.save()
  .then(result => {
    console.log('Review saved!')
    mongoose.connection.close()
  })
  .catch(error => {
    console.log(error)
  })
