require('./mongo')

const cors = require('cors')
const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

// import middleware
const logger = require('./middleware/loggerMiddleware')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

// Import controllers
const usersRouter = require('./controllers/users')
const reviewsRouter = require('./controllers/reviews')
const loginRouter = require('./controllers/login')

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

app.use('/api/login', loginRouter)

app.use('/api/reviews', reviewsRouter)

app.use('/api/users', usersRouter)

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())

app.use(handleErrors)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
