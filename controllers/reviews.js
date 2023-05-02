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

usersRouter.delete('/:id', async (request, response, next) => {
  try {
    const { id } = request.params
    const result = await Review.findOneAndRemove({ _id: id })

    if (result === null) {
      next('CastError')
      // return response.status(400).json({ error: 'Invalid review ID' })
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const review = request.body

  if (!review || !review.content || !review.title) {
    return response.status(400).json({
      error: 'review content is missing'
    })
  }

  const newReview = new Review({
    title: review.title,
    content: review.content,
    important: typeof review.important !== 'undefined' ? review.important : false
  })

  try {
    const savedReview = await newReview.save()
    response.status(200).json(savedReview)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
