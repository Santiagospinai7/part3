const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password } = body

  const user = new User({
    username,
    name,
    passwordHash: password
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
