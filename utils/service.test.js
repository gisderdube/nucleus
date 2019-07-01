import test from 'ava'

const { getSchemaProperties } = require('./service')

test('getSchemaProperties with system properties', t => {
    const schema = {
        _required: true,
        _min: 3,
        name: 'String',
        age: 15,
    }

    t.deepEqual(getSchemaProperties(schema), {
        _required: true,
        _min: 3,
    })
})

test('getSchemaProperties with non-system properties', t => {
    const schema = {
        _required: true,
        _min: 3,
        name: 'String',
        age: 15,
    }

    t.deepEqual(getSchemaProperties(schema, false), {
        name: 'String',
        age: 15,
    })
})
