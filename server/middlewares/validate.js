const { getSchemaProperties } = require('../../utils/service')
const validateUtil = require('../../utils/validate')

/**
schema: {
    name: {
        _array: true,
        _type: 'String',
    }
    address: {
        street: {
            _type: 'String'
        },
        number: {
            _type: 'Number',
            _min: 1,
        },
    },
}

data: {
    name: 'Mark',
    address: {
        street: 'Hauptstraße',
        number: 4,
    },
}
 */

const validate = (schema, data, stack = '') => {
    const d = {}
    Object.keys(schema)
        .filter(el => el.charAt(0) !== '_')
        .forEach(schemaKey => {
            const schemaValue = schema[schemaKey]
            const dataValue = data[schemaKey]

            if (!schemaValue._required && dataValue === undefined) return

            if (Object.keys(getSchemaProperties(schemaValue, false)).length === 0) {
                // means that it is not a nested object
                try {
                    if (schemaValue._array) {
                        // array
                        if (!Array.isArray(dataValue)) throw new Error()
                        else {
                            dataValue.forEach(arrValue =>
                                validateUtil(
                                    schemaValue._type,
                                    arrValue,
                                    getSchemaProperties(schemaValue)
                                )
                            )
                        }
                    } else {
                        // simple value
                        validateUtil(schemaValue._type, dataValue, getSchemaProperties(schemaValue))
                    }
                    d[schemaKey] = dataValue
                } catch (err) {
                    throw new ServiceError(
                        'INVALID_PARAM',
                        `${stack}${stack.length ? '.' : ''}${schemaKey} - ${err.message}`
                    )
                }
            } else {
                // is a nested object
                if (schemaValue._required && dataValue === undefined) {
                    throw new ServiceError(
                        'INVALID_PARAM',
                        `${stack}${stack.length ? '.' : ''}${schemaKey} is required, but missing.`
                    )
                }

                if (schemaValue._array) {
                    // array of nested objects
                    if (!Array.isArray) {
                        throw new ServiceError(
                            'INVALID_PARAM',
                            `${stack}${
                                stack.length ? '.' : ''
                            }${schemaKey} is expected to be Array, but got explicit value`
                        )
                    }

                    d[schemaKey] = dataValue.map((arrValue, index) =>
                        validate(
                            schemaValue,
                            arrValue,
                            `${stack}${stack.length ? '.' : ''}${schemaKey}[${index}]`
                        )
                    )
                } else {
                    // just nested object
                    d[schemaKey] = validate(
                        schemaValue,
                        dataValue,
                        `${stack}${stack.length ? '.' : ''}${schemaKey}`
                    )
                }
            }
        })

    return d
}

module.exports = validate
