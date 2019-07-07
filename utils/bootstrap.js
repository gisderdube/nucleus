const logger = require('loglevel')
const ServiceError = require('./ServiceError')

const { connect } = require('./mongo')

const bootstrap = async () => {
    const config = global.NUCLEUS_CONFIG

    global.ServiceError = ServiceError

    // set logging
    if (config.IS_PRODUCTION) logger.setLevel('info')
    else logger.setLevel('trace')

    if (NUCLEUS_CONFIG.MONGODB_URI && !NUCLEUS_CONFIG.IS_TEST) {
        await connect(
            config.MONGODB_URI,
            config.MONGODB_MODELS_PATH
        )
    }
}

if (NUCLEUS_CONFIG.IS_TEST) bootstrap()

module.exports = bootstrap
