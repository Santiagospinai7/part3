require('./mongo')

const cors = require('cors')
const express = require('express')
const logger = require('./loggerMiddleware')
const Review = require('./models/Review')

const app = express()

app.use(cors())
app.use(express.json()) // initial Parse JSON bodies

app.use(logger)

let reviews = [
  {
    id: 1,
    title: 'HTML is easy',
    content: 'HTML is easy!',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    title: 'Browser can execute only Javascript',
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    title: 'GET and POST are the most important methods of HTTP protocol',
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

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

app.get('/api/reviews/:id', (request, response) => {
  const id = request.params.id
  const review = reviews.find(review => review.id === Number(id))
  console.log('show notes')

  if (review) {
    response.json(review)
  } else {
    // response.send('<h1>no hay</h1>');
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  reviews = reviews.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const review = request.body

  if (!review || !review.content || !review.title) {
    return response.status(400).json({
      error: 'review content is missing'
    })
  }

  // Get all the ids
  const ids = reviews.map(review => review.id)
  // Get the max id from the ids variable
  // const maxId = Math.max(...ids)

  // Create a new review object
  const newReview = {
    id: Math.max(...ids) + 1,
    title: review.title,
    content: review.content,
    important: typeof review.important !== 'undefined' ? review.important : false,
    date: new Date().toISOString()
  }

  reviews = [...reviews, newReview]

  // Use body parser to parse the body of the request
  response.status(201).json(review)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
