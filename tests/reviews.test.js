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

  // parallel
  // const reviewObjects = initialReviews.map(review => new Review(review))
  // const promiseArray = reviewObjects.map(review => review.save())
  // await Promise.all(promiseArray)

  // sequential
  for (const review of initialReviews) {
    const reviewObject = new Review(review)
    await reviewObject.save()
  }
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
    .expect(200)
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

// GET an invalid review id
test('an invalid review can not be viewed', async () => {
  await api
    .get('/api/reviews/1234')
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

// DELETE not can be deleted
test('a review can be deleted', async () => {
  const { response } = await getAllContentFromReviews()
  const { body: reviews } = response
  const reviewToDelete = reviews[0]

  await api
    .delete(`/api/reviews/${reviewToDelete.id}`)
    .expect(204)

  const { contents, response: secondResponse } = await getAllContentFromReviews()

  expect(secondResponse.body).toHaveLength(initialReviews.length - 1)
  expect(contents).not.toContain(reviewToDelete.content)
})

// DELETE not be deleted
test('a invalid review can not be deleted', async () => {
  await api
    .delete('/api/reviews/12345')
    .expect(400)

  const { response } = await getAllContentFromReviews()

  expect(response.body).toHaveLength(initialReviews.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
