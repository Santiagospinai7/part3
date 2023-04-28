require('./mongo')

const cors = require('cors')
const express = require('express')
const logger = require('./loggerMiddleware')
const Review = require('./models/Review')

const app = express()

app.use(cors())
app.use(express.json()) // initial Parse JSON bodies

app.use(logger)

// const reviews = [
//   {
//     id: 1,
//     title: 'HTML is easy',
//     content: 'HTML is easy!',
//     date: '2019-05-30T17:30:31.098Z',
//     important: true
//   },
//   {
//     id: 2,
//     title: 'Browser can execute only Javascript',
//     content: 'Browser can execute only Javascript',
//     date: '2019-05-30T18:39:34.091Z',
//     important: false
//   },
//   {
//     id: 3,
//     title: 'GET and POST are the most important methods of HTTP protocol',
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     date: '2019-05-30T19:20:14.298Z',
//     important: true
//   }
// ]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' });
//   response.end(JSON.stringify(notes));
// });

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/reviews', (request, response) => {
  Review.find({}).then(reviews => {
    response.json(reviews)
  })
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

  Review.findByIdAndUpdate(id, newReviewInfo)
    .then(result => {
      // Result is the updated review
      response.status(200).json(result)
    }).catch(error => {
      next(error)
    })
})

app.delete('/api/reviews/:id', (request, response, next) => {
  const { id } = request.params
  Review.findOneAndRemove(id).then(result => {
    response.status(204).end()
  }).catch(error => { next(error) })
})

app.post('/api/reviews', (request, response) => {
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
    })

  // Use body parser to parse the body of the request
  // response.status(201).json(review)
})

app.use((error, request, response, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'bad id typed' })
  } else {
    return response.status(500).end()
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
