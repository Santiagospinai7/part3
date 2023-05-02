const mongoose = require('mongoose')
const supertest = require('supertest')
const { app, server } = require('../index')
const Review = require('../models/Review')

const api = supertest(app)

const initialReviews = [
  {
    title: 'Review 1',
    content: 'This is the content of the review 1',
    date: new Date(),
    important: true
  },
  {
    title: 'Review 2',
    content: 'This is the content of the review 2',
    date: new Date(),
    important: true
  }
]

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
  const response = await api.get('/api/reviews')
  expect(response.body).toHaveLength(initialReviews.length)
})

// Get the first review
test('the first review is about Review 1', async () => {
  const response = await api.get('/api/reviews')
  expect(response.body[0].content).toBe('This is the content of the review 1')
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
