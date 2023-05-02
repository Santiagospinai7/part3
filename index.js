require('./mongo')

const cors = require('cors')
const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

// import middleware
const logger = require('./middleware/loggerMiddleware')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

const Review = require('./models/Review')

const app = express()

app.use(cors())
app.use(express.json()) // initial Parse JSON bodies

Sentry.init({
  dsn: 'https://05a850a7ff3a47c6a6edcd93f8c1a6ab@o4505107991822336.ingest.sentry.io/4505107993853952',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

app.use(logger)

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/reviews', async (request, response) => {
  const reviews = await Review.find({})
  response.json(reviews)
})

app.get('/api/reviews/:id', (request, response, next) => {
  const { id } = request.params

  Review.findById(id).then(review => {
    if (review) {
      console.log(review)
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

app.put('/api/reviews/:id', (request, response, next) => {
  const { id } = request.params

  const review = request.body

  const newReviewInfo = {
    title: review.title,
    content: review.content,
    important: review.important
  }

  Review.findByIdAndUpdate(id, newReviewInfo, { new: true })
    .then(result => {
      // Result is the old review
      response.status(200).json(result)
    }).catch(error => {
      next(error)
    })
})

app.delete('/api/reviews/:id', (request, response, next) => {
  const { id } = request.params
  Review.findOneAndRemove(id).then(() => {
    response.status(204).end()
  }).catch(error => { next(error) })
})

app.post('/api/reviews', (request, response, next) => {
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

  newReview.save()
    .then(savedReview => {
      response.status(201).json(savedReview)
    }).catch(error => {
      next(error)
    })

  // Use body parser to parse the body of the request
  // response.status(201).json(review)
})

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())

app.use(handleErrors)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
