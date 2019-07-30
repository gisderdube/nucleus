const { decode } = require('../../utils/token')

const createIdentity = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization')
        if (!authHeader) throw new Error('no auth header')
        const token = authHeader.split('Bearer ').join('')
        req.identity = decode(token)
    } catch (err) {
    } finally {
        if (!req.identity) req.identity = {}
        next()
    }
}

module.exports = createIdentity
