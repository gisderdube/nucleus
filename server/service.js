const express = require('express')
const router = express.Router()
const logger = require('loglevel')

const error = require('./middlewares/error')
const access = require('./middlewares/access')
const prepare = require('./middlewares/prepare')
const sanitize = require('./middlewares/sanitize')
const validate = require('./middlewares/validate')

const callService = async (req, res, data, config) => {
    const { identity } = req
    try {
        const { service, schema, ...options } = require(`${config.SERVICE_PATH}${req.path.replace(
            config.SERVICE_ENDPOINT,
            ''
        )}`)
        try {
            access(options, identity)
            const { data: preparedData, schema: preparedSchema } = prepare(schema, data)
            const validatedData = validate(preparedSchema, preparedData)
            const sanitizedData = sanitize(preparedSchema, validatedData)
            // if (req.headers['peeces-language']) identity.language = req.headers['peeces-language'] TODO
            const result = await service(sanitizedData, identity)

            res.send(result)
        } catch (err) {
            if (err instanceof ServiceError) throw err
            logger.error(err)
            throw new ServiceError('INTERNAL')
        }
    } catch (err) {
        if (err instanceof ServiceError) return error(res, err)
        logger.error(err)
        // if the error comes from the require (meaning it is not a service error), it does not have a code
        return error(res, new ServiceError('NOT_FOUND', 'The requested endpoint does not exist.'))
    }
}

function setupServiceRoutes(server, config) {
    server.get('/service/*', (req, res) => {
        callService(req, res, req.query, config)
    })

    server.post('/service/*', (req, res) => {
        const { body: data } = req

        callService(req, res, data, config)
    })
}

module.exports = setupServiceRoutes
