const logger = require('loglevel')

const error = require('./middlewares/error')
const access = require('./middlewares/access')
const prepare = require('./middlewares/prepare')
const sanitize = require('./middlewares/sanitize')
const validate = require('./middlewares/validate')
const callService = async (req, res, data) => {
    const { trackError = () => {} } = NUCLEUS_CONFIG
    const { identity } = req
    try {
        data = { ...data, ...req.files }
        const { service, schema, ...options } = require(`${
            NUCLEUS_CONFIG.SERVICE_PATH
        }${req.requestedServicePath.replace(NUCLEUS_CONFIG.SERVICE_ENDPOINT, '')}`)
        try {
            access(options, identity)
            const { data: preparedData, schema: preparedSchema } = prepare(schema, data)
            const validatedData = validate(preparedSchema, preparedData)
            const sanitizedData = sanitize(preparedSchema, validatedData)
            const result = await service(sanitizedData, identity)

            res.send(result)
        } catch (err) {
            if (err instanceof ServiceError) throw err
            logger.error(err)
            trackError(err)
            throw new ServiceError('INTERNAL')
        }
    } catch (err) {
        if (err instanceof ServiceError) return error(res, err)
        logger.error(err)
        trackError(err)
        // if the error comes from the require (meaning it is not a service error), it does not have a code
        return error(res, new ServiceError('NOT_FOUND', 'The requested endpoint does not exist.'))
    }
}

function setupServiceRoutes(server) {
    server.get(`${NUCLEUS_CONFIG.SERVICE_ENDPOINT}/*`, (req, res) => {
        callService(req, res, req.query)
    })

    server.post(`${NUCLEUS_CONFIG.SERVICE_ENDPOINT}/*`, (req, res) => {
        const { body: data } = req

        callService(req, res, data)
    })
}

module.exports = setupServiceRoutes
