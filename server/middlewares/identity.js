const { decode } = require('../../utils/token')

const createIdentity = (req, res, next) => {
    const authHeader = req.get('Authorization')

    if (!authHeader) return next()

    const token = authHeader.split('Bearer ').join('')
    try {
        req.identity = decode(token)
    } catch (err) {
    } finally {
        if (!req.identity) req.identity = {}
        next()
    }
}

module.exports = createIdentity
