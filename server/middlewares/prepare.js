const prepare = (schema, data) => {
    const preparedSchema = prepareSchema(schema)
    return {
        schema: preparedSchema,
        data: prepareData(data, preparedSchema),
    }
}

const prepareSchema = schema => {
    const preparedSchema = {}
    Object.keys(schema).forEach(key => {
        if (key.charAt(0) === '_') {
            // key is a reserved system key, e.g. _type or _sanitize

            const isNested = !!Object.keys(schema).find(el => el.charAt(0) !== '_')
            const isAllowed = key === '_required' || key === '_array'

            if (isNested && !isAllowed) return
            preparedSchema[key] = schema[key]
        } else if (typeof schema[key] === 'string') {
            // shorthand _type declarations, e.g. first_name: 'String'
            preparedSchema[key] = { _type: schema[key] }
        } else {
            /**
             * nested declarations, e.g.
             * schema: {
             *     name: 'String',
             *     address: {
             *         street: 'String',
             *         number: {
             *             _type: 'Number',
             *             _min: 1,
             *         },
             *     },
             * }
             */
            preparedSchema[key] = prepareSchema(schema[key])
        }
    })

    return preparedSchema
}

function prepareData(data, schema) {
    const preparedData = {}

    Object.keys(data).forEach(key => {
        // NOTE: we're not going deeper than one level for objects. The reason we're parsing values here in the first place is for FormData, which only supports top level fields.
        if (!schema[key]) return null
        else if (data[key] === '' || data[key] === undefined) return delete data[key]
        else if (typeof data[key] === 'object') preparedData[key] = data[key]
        else if (data.hasOwnProperty(key)) {
            const expectedType = schema[key]._type
            const value = data[key]
            if (expectedType === 'Boolean' && typeof value !== 'boolean') {
                if (value === 'true') preparedData[key] = true
                else if (value === 'false') preparedData[key] = false
            } else if (expectedType === 'Number' && typeof value !== 'number') {
                const parsed = parseFloat(value)
                preparedData[key] = parsed
                if (isNaN(parsed)) delete preparedData[key]
            } else preparedData[key] = value
        }
    })

    return preparedData
}

module.exports = prepare
