const usersRouter = require('express').Router()
const Review = require('../models/Review')

usersRouter.get('/', async (request, response) => {
  const reviews = await Review.find({})
  response.json(reviews)
})

usersRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Review.findById(id).then(review => {
    if (review) {
      response.json(review)
    } else {
      // response.send('<h1>no hay</h1>');
      response.status(404).end()
    }
  }).catch(error => {
    // response.status(400).send({ error: 'bad formatted id' }).end()
    // response.status(400).end()
    next(error)
  })
})

usersRouter.put('/:id', (request, response, next) => {
  const { id } = request.params

  const review = request.body

  const newReviewInfo = {
    title: review.title,
    content: review.content,
    important: review.important
  }

  Review.findByIdAndUpdate(id, newReviewInfo, { new: true })
    .then(result => {
      response.status(200).json(result)
    }).catch(error => {
      next(error)
    })
})

module.exports = usersRouter
