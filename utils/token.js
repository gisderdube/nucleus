const jwt = require('jsonwebtoken')

const encode = (data, JWT_SECRET) => jwt.sign({ payload: data }, JWT_SECRET)

const decode = (token, JWT_SECRET) => jwt.verify(token, JWT_SECRET).payload

module.exports = { encode, decode }
