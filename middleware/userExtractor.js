const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authorization = request.get('authorization')

  let token = null

  try {
    if (authorization !== undefined) {
      if (authorization || authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7)
      }
    }
  } catch (error) {
    next(error)
  }

  // decode token
  let decodedToken = null
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY)
  } catch (error) {
    next(error)
  }

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const { id: userId } = decodedToken
  request.userId = userId

  next()
}
