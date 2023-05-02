const mongoose = require('mongoose')
const { server } = require('../index')
const Review = require('../models/Review')
const {
  api,
  initialReviews,
  getAllContentFromReviews
} = require('./test_helper')

beforeEach(async () => {
  await Review.deleteMany({})

  const review1 = new Review(initialReviews[0])
  await review1.save()

  const review2 = new Review(initialReviews[1])
  await review2.save()
})

// test return the reviews as json
test('reviews are returned as json', async () => {
  await api
    .get('/api/reviews')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// test return all the reviews
test('all reviews are returned', async () => {
  const { response } = await getAllContentFromReviews()
  expect(response.body).toHaveLength(initialReviews.length)
})

// Get the first review
test('the fa review content', async () => {
  const { contents } = await getAllContentFromReviews()
  expect(contents).toContain('This is the content of the review 1')
})

// Post a new review
test('a valid review can be added', async () => {
  const newReview = {
    title: 'Review 3',
    content: 'This is the content of the review 3',
    important: true
  }

  await api
    .post('/api/reviews')
    .send(newReview)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const { contents, response } = await getAllContentFromReviews()

  expect(response.body).toHaveLength(initialReviews.length + 1)
  expect(contents).toContain(newReview.content)
})

// POST a review without content
test('review without content is not added', async () => {
  const newReview = {
    title: 'Review 3',
    important: true
  }

  await api
    .post('/api/reviews')
    .send(newReview)
    .expect(400)

  const { response } = await getAllContentFromReviews()
  expect(response.body).toHaveLength(initialReviews.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
