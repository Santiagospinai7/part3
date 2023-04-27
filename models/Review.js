const { model, Schema } = require('mongoose')

// Define a schema
const reviewSchema = new Schema({
  title: String,
  content: String,
  date: Date,
  important: Boolean
})

// Define a model to create reviews
const Review = model('Review', reviewSchema)

module.exports = Review

// create a new Review
// const review = new Review({
//   title: 'Review 1',
//   content: 'This is the content of the review',
//   date: new Date(),
//   important: true
// })

// review.save()
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(error => {
//     console.log(error)
//   })

// Get all the reviews
// Review.find({})
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
