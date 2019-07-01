const prepare = (schema, data) => {
    return {
        schema: prepareSchema(schema),
        data: { ...data },
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

module.exports = prepare
