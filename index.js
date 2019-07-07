const startServer = require('./server')
const { callService } = require('./utils/service')
const { encode } = require('./utils/token')

module.exports = {
    startServer,
    callService,
    encode,
}
