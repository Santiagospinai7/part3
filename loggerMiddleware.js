const logger = (request, response, next) => {
  console.log('Middleware')
  next()
}

module.exports = logger
