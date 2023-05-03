const mongoose = require('mongoose')
const { server } = require('../index')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'root', name: 'root', email: 'root@gmail.com', passwordHash })

  await user.save()
})

describe('Create a new User', () => {
  test('is possible with a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'user',
      name: 'user',
      email: 'user@gmail.com',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('is not possible with an already taken username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'root',
      name: 'root',
      email: 'root@gmail.com',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.errors.username.message).toContain('`username` to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('Login a User', () => {
  test('succeeds with valid credentials', async () => {
    const credentials = {
      username: 'root',
      password: 'password'
    }

    const result = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.token).toBeDefined()
  })

  test('fails with invalid credentials', async () => {
    const credentials = {
      username: 'root',
      password: 'invalid'
    }

    const result = await api
      .post('/api/login')
      .send(credentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid username or password')
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
