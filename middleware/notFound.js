const notFound = (request, response) => {
  response.status(404).end()
}

module.exports = notFound
