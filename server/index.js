const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const enforce = require('express-sslify')
const chalk = require('chalk')
const portfinder = require('portfinder')
const logger = require('loglevel')
const fileUpload = require('express-fileupload')

const identity = require('./middlewares/identity')
const error = require('./middlewares/error')

const { connect } = require('../utils/mongo')
const bootstrap = require('../utils/bootstrap')
const setupServiceRoutes = require('./service')

require('./config')

const startServer = async (
    routes = () => {}, // will be setup after the normal routes
    middlewares = () => {} // will be setup before the normal routes will be handled, e.g. service routes
) => {
    const config = global.NUCLEUS_CONFIG
    if (!config.SERVICE_PATH) {
        throw new Error(
            'Please provide a path to the services (SERVICE_PATH) folder in the server config.'
        )
    }

    bootstrap()

    const server = express()

    if (config.ENFORCE_SSL && (config.IS_PRODUCTION || config.IS_STAGING)) {
        server.use(enforce.HTTPS({ trustProtoHeader: true }))
    }
    server.use(helmet())
    server.use(compression())

    if (config.IS_DEV) server.use(morgan('dev'))
    else server.use(morgan('common'))

    server.use('*', identity)
    await middlewares(server)

    server.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }))
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))

    await setupServiceRoutes(server)
    await routes(server)
    server.get('/', (req, res) => {
        // NOTE this should actually never be triggered, if routes are defined in setup()
        res.send('Hello from Nucleus!')
    })
    server.use((req, res) => {
        return error(res, new ServiceError('NOT_FOUND', 'The requested resource does not exist.'))
    })

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
