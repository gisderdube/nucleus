const logger = require('loglevel')

const prepare = require('../server/middlewares/prepare')
const validate = require('../server/middlewares/validate')

const getSchemaProperties = (schema, system = true) => {
    const opts = {}
    Object.keys(schema).forEach(key => {
        if (key.charAt(0) === '_' && system) opts[key] = schema[key]
        if (key.charAt(0) !== '_' && !system) opts[key] = schema[key]
    })

    return opts
}

const callService = async (endpoint, data, identity = {}) => {
    const sanitize = require('../server/middlewares/sanitize') // TODO move to top

    const { service, schema, ...options } = require(`${NUCLEUS_CONFIG.SERVICE_PATH}${endpoint}`)
    const { data: preparedData, schema: preparedSchema } = prepare(schema, data)
    const validatedData = validate(preparedSchema, preparedData)
    const sanitizedData = sanitize(preparedSchema, validatedData)
    const result = await service(sanitizedData, identity)

    return result
}

module.exports = { getSchemaProperties, callService }
