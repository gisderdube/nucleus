const getSchemaProperties = (schema, system = true) => {
    const opts = {}
    Object.keys(schema).forEach(key => {
        if (key.charAt(0) === '_' && system) opts[key] = schema[key]
        if (key.charAt(0) !== '_' && !system) opts[key] = schema[key]
    })

    return opts
}

module.exports = { getSchemaProperties }
