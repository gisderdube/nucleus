import test from 'ava'

const prepare = require('./prepare')

test('do not change internal declarations', t => {
    const schema = {
        name: {
            _type: 'String',
            _required: true,
            _maxLength: 5,
        },
    }

    const { schema: preparedSchema } = prepare(schema, {})

    t.deepEqual(preparedSchema, schema)
})

test('convert shorthand type declarations', t => {
    const schema = { name: 'String' }

    const { schema: preparedSchema } = prepare(schema, {})

    t.deepEqual(preparedSchema, { name: { _type: 'String' } })
})

test('traverse nested declarations', t => {
    const schema = {
        name: 'String',
        address: {
            street: 'String',
            number: {
                _type: 'Number',
                _min: 5,
            },
            another_field: {
                yet_another_field: 'Date',
                another_nested_field: { _type: 'Boolean' },
            },
        },
    }

    const { schema: preparedSchema } = prepare(schema, {})

    t.deepEqual(preparedSchema, {
        name: { _type: 'String' },
        address: {
            street: { _type: 'String' },
            number: {
                _type: 'Number',
                _min: 5,
            },
            another_field: {
                yet_another_field: { _type: 'Date' },
                another_nested_field: { _type: 'Boolean' },
            },
        },
    })
})

test('strip system options (except _required and _array) from nested declarations', t => {
    const schema = {
        name: 'String',
        address: {
            _required: true,
            _array: true,
            _minLength: 4,
            street: 'String',
            number: {
                _type: 'Number',
                _min: 5,
            },
            another_field: {
                yet_another_field: 'Date',
                another_nested_field: { _type: 'Boolean' },
            },
        },
    }

    const { schema: preparedSchema } = prepare(schema, {})
    t.deepEqual(preparedSchema, {
        name: { _type: 'String' },
        address: {
            _required: true,
            _array: true,
            street: { _type: 'String' },
            number: {
                _type: 'Number',
                _min: 5,
            },
            another_field: {
                yet_another_field: { _type: 'Date' },
                another_nested_field: { _type: 'Boolean' },
            },
        },
    })
})
