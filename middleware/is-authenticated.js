const jwt = require('jsonwebtoken')
const { TokenExpiredError } = jwt
module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1] // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('No Token Provided!')
    }
    try {
      const decodedToken = jwt.verify(token, 'supersecret_dont_share')
      req.userId = decodedToken.userId
      next()
    } catch (error) {
      //   console.log(error)
      if (error instanceof TokenExpiredError) {
        return res.status(401).send(error)
      }
      return res.status(401).send({ message: 'Authentication failed!' })
    }
  } catch (err) {
    console.log('middleware error', err)
    const error = new Error('Authentication failed! Something went wrong')
    return next(error)
  }
}
