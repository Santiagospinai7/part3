module.exports = (error, request, response, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'bad id typed' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).send({ error: 'invalid token' })
  } else {
    return response.status(500).end()
  }
}
