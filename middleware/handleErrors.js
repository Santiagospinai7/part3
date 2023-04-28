module.exports = (error, request, response, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'bad id typed' })
  } else {
    return response.status(500).end()
  }
}
