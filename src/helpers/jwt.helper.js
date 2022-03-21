const jwt = require('jsonwebtoken')
const createError = require('http-errors')

exports.verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['apikey']
  if(!apiKey) return next(createError(400, 'Api Key is required'))

  if(apiKey != process.env.APIKEY) return next(createError(400, 'Invalid key'))

  next()
}

exports.signAccessToken = (id) => {
  return new Promise((resolve, reject)  => {
    const payload = {}
    const secret = process.env.ACCESS_TOKEN_SECRET
    const options = {
      expiresIn: '3h',
      issuer: 'phincon.attendance',
      audience: id,
    }
    jwt.sign(payload, secret, options, (err, token) => {
      if(err) {
        console.log(err.message)
        return reject(createError.Forbidden())
      }
      resolve(token)
    })
  })
}

exports.verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return next(createError.Unauthorized())

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Forbidden' : err.message
      return next(createError.Forbidden(message))
    }
    req.payload = payload
    next()
  })
}
