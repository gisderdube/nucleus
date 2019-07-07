const jwt = require('jsonwebtoken')

const { JWT_SECRET } = NUCLEUS_CONFIG

const encode = data => jwt.sign({ payload: data }, JWT_SECRET)

const decode = token => jwt.verify(token, JWT_SECRET).payload

module.exports = { encode, decode }
