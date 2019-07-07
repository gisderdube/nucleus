const startServer = require('./server')
const { callService } = require('./utils/service')
const { encode, decode } = require('./utils/token')

module.exports = {
    startServer,
    callService,
    encode,
    decode,
}
