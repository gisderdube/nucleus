const logger = require('loglevel')
const ServiceError = require('./ServiceError')

const bootstrap = async config => {
    global.ServiceError = ServiceError

    // set logging
    if (config.IS_PRODUCTION) logger.setLevel('info')
    else logger.setLevel('trace')
}

if (process.env.NODE_ENV === 'test') bootstrap()

module.exports = bootstrap
