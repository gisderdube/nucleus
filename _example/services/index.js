const logger = require('loglevel')

const prepare = rrequire('routes/middlewares/service/prepare')
const sanitize = rrequire('routes/middlewares/service/sanitize')
const validate = rrequire('routes/middlewares/service/validate')

module.exports = async (endpoint, data, identity = {}) => {
    // TODO
    const { service, schema, ...options } = rrequire(`services${endpoint}`)
    const { data: preparedData, schema: preparedSchema } = prepare(schema, data)
    const validatedData = validate(preparedSchema, preparedData)
    const sanitizedData = sanitize(preparedSchema, validatedData)
    const result = await service(sanitizedData, identity)

    return result
}
