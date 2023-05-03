const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')

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

const getAllContentFromReviews = async () => {
  const response = await api.get('/api/reviews')
  const contents = response.body.map(r => r.content)
  return {
    response,
    contents
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialReviews,
  getAllContentFromReviews,
  getUsers
}
