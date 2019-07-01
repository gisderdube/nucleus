const sanitizeUtil = require('../../utils/sanitize')
const { getSchemaProperties } = require('../../utils/service')

const sanitize = (schema, data) => {
    const d = {}
    Object.keys(schema)
        .filter(el => el.charAt(0) !== '_')
        .forEach(schemaKey => {
            const schemaValue = schema[schemaKey]
            const dataValue = data[schemaKey]
            if (dataValue === undefined) return

            if (Object.keys(getSchemaProperties(schemaValue, false)).length === 0) {
                // means that it is not a nested object
                if (schemaValue._array) {
                    // array
                    d[schemaKey] = dataValue.map(arrValue =>
                        sanitizeUtil(schemaValue._type, arrValue, schemaValue._sanitize)
                    )
                } else {
                    // simple value
                    d[schemaKey] = sanitizeUtil(schemaValue._type, dataValue, schemaValue._sanitize)
                }
            } else {
                // is a nested object
                if (schemaValue._array) {
                    // array of nested objects
                    d[schemaKey] = dataValue.map(arrValue => sanitize(schemaValue, arrValue))
                } else {
                    // just nested object
                    d[schemaKey] = sanitize(schemaValue, dataValue)
                }
            }
        })
    return d
}

module.exports = sanitize
