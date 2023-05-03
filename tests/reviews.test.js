const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { server } = require('../index')
const Review = require('../models/Review')
const User = require('../models/User')
const {
  api,
  initialReviews,
  getAllContentFromReviews
} = require('./test_helper')

beforeAll(async () => {
  await User.deleteMany({})

  // create a user
  const user = new User({
    username: 'test',
    name: 'test',
    password: 'test'
  })

  await user.save()
})

beforeEach(async () => {
  await Review.deleteMany({})

  // sequential
  for (const review of initialReviews) {
    const reviewObject = new Review(review)
    await reviewObject.save()
  }
})

describe('Get a review', () => {
  // test return the reviews as json
  test('get all reviews as a json', async () => {
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
  test('the first review content', async () => {
    const { contents } = await getAllContentFromReviews()
    expect(contents).toContain('This is the content of the review 1')
  })

  // GET an invalid review id
  test('an invalid review can not be viewed', async () => {
    await api
      .get('/api/reviews/1234')
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Create a review', () => {
  // Post a new review
  test('is possible with a valid review', async () => {
    const user = await User.findOne({ username: 'test' })

    console.log(user)

    const userForToken = {
      id: user._id,
      username: user.username
    }

    // login user
    const token = jwt.sign(userForToken, process.env.SECRET_KEY)

    const newReview = {
      title: 'Review 3',
      content: 'This is the content of the review 3',
      important: true
    }

    await api
      .post('/api/reviews')
      .set('Authorization', `bearer ${token}`)
      .send(newReview)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromReviews()

    expect(response.body).toHaveLength(initialReviews.length + 1)
    expect(contents).toContain(newReview.content)
  })

  // POST a review without content
  test('is not possible without a content in the review', async () => {
    const user = await User.findOne({ username: 'test' })

    const userForToken = {
      id: user._id,
      username: user.username
    }

    // login user
    const token = jwt.sign(userForToken, process.env.SECRET_KEY)

    const newReview = {
      title: 'Review 3',
      important: true
    }

    await api
      .post('/api/reviews')
      .set('Authorization', `bearer ${token}`)
      .send(newReview)
      .expect(400)

    const { response } = await getAllContentFromReviews()
    expect(response.body).toHaveLength(initialReviews.length)
  })

  // POST a review without token
  test('is not possible without a token', async () => {
    const newReview = {
      title: 'Review 3',
      content: 'This is the content of the review 3',
      important: true
    }

    await api
      .post('/api/reviews')
      .send(newReview)
      .expect(401)

    const { response } = await getAllContentFromReviews()
    expect(response.body).toHaveLength(initialReviews.length)
  })
})

describe('Delete a review', () => {
  // DELETE can be deleted
  test('a review can be deleted', async () => {
    const user = await User.findOne({ username: 'test' })

    const userForToken = {
      id: user._id,
      username: user.username
    }

    // login user
    const token = jwt.sign(userForToken, process.env.SECRET_KEY)

    const { response } = await getAllContentFromReviews()
    const { body: reviews } = response
    const reviewToDelete = reviews[0]

    await api
      .delete(`/api/reviews/${reviewToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const { contents, response: secondResponse } = await getAllContentFromReviews()

    expect(secondResponse.body).toHaveLength(initialReviews.length - 1)
    expect(contents).not.toContain(reviewToDelete.content)
  })

  // DELETE not be deleted
  test('a invalid review can not be deleted (invalid id)', async () => {
    const user = await User.findOne({ username: 'test' })

    const userForToken = {
      id: user._id,
      username: user.username
    }

    // login user
    const token = jwt.sign(userForToken, process.env.SECRET_KEY)

    await api
      .delete('/api/reviews/12345')
      .set('Authorization', `bearer ${token}`)
      .expect(400)

    const { response } = await getAllContentFromReviews()

    expect(response.body).toHaveLength(initialReviews.length)
  })

  // DELETE not be deleted (without token)
  test('a review can not be deleted without a token', async () => {
    const { response } = await getAllContentFromReviews()
    const { body: reviews } = response
    const reviewToDelete = reviews[0]

    await api
      .delete(`/api/reviews/${reviewToDelete.id}`)
      .expect(401)

    const { contents, response: secondResponse } = await getAllContentFromReviews()

    expect(secondResponse.body).toHaveLength(initialReviews.length)
    expect(contents).toContain(reviewToDelete.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
