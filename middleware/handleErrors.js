const ERROR_HANDLERS = {
  CastError: response => response.status(400).send({ error: 'bad id typed' }),
  JsonWebTokenError: response => response.status(401).send({ error: 'token is missing or invalid token' }),
  TokenExpiredError: response => response.status(401).send({ error: 'token expired' }),
  validationError: (response, error) => response.status(409).send({ error: error.message }),
  defaultError: response => response.status(500).end()
}

module.exports = (error, request, response, next) => {
  console.log('error', error)

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(response, error)
}
