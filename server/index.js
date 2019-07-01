const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const enforce = require('express-sslify')
const chalk = require('chalk')
const portfinder = require('portfinder')
const logger = require('loglevel')

const { connect } = require('../utils/mongo')
const bootstrap = require('../utils/bootstrap')
const setupServiceRoutes = require('./service')

const DEFAULT_CONFIG = {
    IS_PRODUCTION: false,
    IS_STAGING: false,
    IS_DEV: true,
    IS_TEST: false,
    PORT: 3000,
    ENFORCE_SSL: true,
    MONGODB_URI: null,
    MONGODB_MODELS_PATH: null,
    SERVICE_PATH: null,
    SERVICE_ENDPOINT: '/service',
}

const startServer = async (setup = () => {}, serverConfig = {}) => {
    const config = {
        ...DEFAULT_CONFIG,
        ...serverConfig,
    }

    if (!config.SERVICE_PATH) {
        throw new Error(
            'Please provide a path to the services (SERVICE_PATH) folder in the server config.'
        )
    }

    // set logging
    bootstrap(config)

    if (config.MONGODB_URI) {
        await connect(
            config.MONGODB_URI,
            config.MONGODB_MODELS_PATH
        )
    }

    const server = express()

    if (config.ENFORCE_SSL && (config.IS_PRODUCTION || config.IS_STAGING)) {
        server.use(enforce.HTTPS({ trustProtoHeader: true }))
    }
    server.use(helmet())
    server.use(compression())

    if (config.IS_DEV) server.use(morgan('dev'))
    else server.use(morgan('common'))

    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))

    setupServiceRoutes(server, config)
    setup(server)

    if (config.IS_TEST) return server.listen()

    portfinder.basePort = config.PORT
    const port = await portfinder.getPortPromise()
    return server.listen(port, () => {
        if (config.IS_DEV) {
            if (port !== config.PORT) {
                logger.info(
                    chalk.yellow.bold(`Could not start server on configured port ${config.PORT}`)
                )
            }
            logger.info(chalk.blue.bold(`Server running at http://localhost:${port}`))
        }
    })
}

module.exports = startServer
