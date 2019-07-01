import test from 'ava'

const validate = require('./validate')

test('correct validation', t => {
    const schema = {
        name: { _type: 'String' },
        address: {
            street: { _type: 'String' },
            number: {
                _type: 'Number',
                _min: 1,
            },
        },
    }

    const data = {
        name: 'Mark',
        address: {
            street: 'Hauptstraße',
            number: 4,
        },
    }
    const validatedData = validate(schema, data)

    t.deepEqual(validatedData, {
        name: 'Mark',
        address: {
            street: 'Hauptstraße',
            number: 4,
        },
    })
})

test('correct validation with non required fields', t => {
    const schema = {
        name: { _type: 'String' },
        address: {
            street: { _type: 'String' },
            number: {
                _type: 'Number',
                _min: 1,
            },
        },
    }

    const data = { name: 'Mark' }
    const validatedData = validate(schema, data)

    t.deepEqual(validatedData, { name: 'Mark' })
})

test('correct validation and ignore incoming data not declared in schema', t => {
    const schema = {
        name: { _type: 'String' },
    }

    const data = { name: 'Mark', some_other_field: 1 }
    const validatedData = validate(schema, data)

    t.deepEqual(validatedData, { name: 'Mark' })
})

test('correct validation for number 0', t => {
    const schema = {
        i: { _type: 'Number' },
    }

    const data = { i: 0 }
    const validatedData = validate(schema, data)

    t.deepEqual(validatedData, { i: 0 })
})

test('correct validation for arrays', t => {
    const schema = {
        name: { _type: 'String', _array: true },
        address: {
            street: { _type: 'String' },
            number: {
                _type: 'Number',
                _min: 1,
            },
        },
    }

    const data = {
        name: ['Mark', 'Mario'],
        address: {
            street: 'Hauptstraße',
            number: 4,
        },
    }
    const validatedData = validate(schema, data)

    t.deepEqual(validatedData, {
        name: ['Mark', 'Mario'],
        address: {
            street: 'Hauptstraße',
            number: 4,
        },
    })
})

test('fail validation for invalid type', t => {
    const schema = {
        name: { _type: 'Number' },
        address: {
            street: { _type: 'String' },
            number: {
                _type: 'Number',
                _min: 1,
            },
        },
    }

    const data = {
        name: 'Mark',
        address: {
            street: 'Hauptstraße',
            number: 4,
        },
    }

    const e = t.throws(() => {
        validate(schema, data)
    })
    t.is(e.code, 'INVALID_PARAM')
    t.true(e.message.includes('name'))

    schema.name._type = 'Date'
    t.throws(() => {
        validate(schema, data)
    })

    schema.name._type = 'ObjectId'
    t.throws(() => {
        validate(schema, data)
    })

    schema.name._type = 'Email'
    t.throws(() => {
        validate(schema, data)
    })
})

test('fail validation for missing required field', t => {
    const schema = {
        name: { _type: 'Number', _required: true },
        address: {
            street: { _type: 'String' },
            number: {
                _type: 'Number',
                _min: 1,
            },
        },
    }

    const data = {
        address: {
            street: 'Hauptstraße',
            number: 4,
        },
    }

    const e = t.throws(() => {
        validate(schema, data)
    })

    t.is(e.code, 'INVALID_PARAM')
    t.true(e.message.includes('name'))
})

test('fail validation for missing required field in nested declaration', t => {
    const schema = {
        name: { _type: 'String' },
        address: {
            _required: true,
            street: { _type: 'String' },
            number: {
                _type: 'Number',
                _min: 1,
            },
        },
    }

    const data = { name: 'Mark' }

    const e = t.throws(() => {
        validate(schema, data)
    })

    t.is(e.code, 'INVALID_PARAM')
    t.is(e.message, 'address is required, but missing.')
})

test('fail validation for invalid type in array', t => {
    const schema = {
        name: { _type: 'String', _array: true },
        address: {
            street: { _type: 'String' },
            number: {
                _type: 'Number',
                _min: 1,
            },
        },
    }

    const data = {
        name: ['Mark', 3],
        address: {
            street: 'Hauptstraße',
            number: 4,
        },
    }

    const e = t.throws(() => {
        validate(schema, data)
    })
})

test('fail validation for required array', t => {
    const schema = {
        name: { _type: 'String', _array: true, _required: true },
    }

    const data = {
        name: ['Mark', 3],
    }

    const e = t.throws(() => {
        validate(schema, data)
    })
})

test('correct validation for deeply nested declarations', t => {
    const schema = {
        name: { _type: 'String' },
        address: {
            street: { _type: 'String' },
            number: {
                one: {
                    three: { _type: 'Number' },
                    four: { _type: 'String' },
                },
                two: { _type: 'Number' },
            },
        },
    }

    const data = {
        name: 'Mark',
        address: {
            street: 'Hauptstraße',
            number: {
                one: {
                    three: 3,
                    four: 'four',
                },
                two: 2,
            },
        },
    }
    const validatedData = validate(schema, data)

    t.deepEqual(validatedData, {
        name: 'Mark',
        address: {
            street: 'Hauptstraße',
            number: {
                one: {
                    three: 3,
                    four: 'four',
                },
                two: 2,
            },
        },
    })
})

test('correct validation for deeply nested declarations and non-required fields', t => {
    const schema = {
        name: { _type: 'String' },
        address: {
            street: { _type: 'String' },
            number: {
                one: {
                    three: { _type: 'Number' },
                    four: { _type: 'String' },
                },
                two: { _type: 'Number' },
            },
        },
    }

    const data = {
        name: 'Mark',
        address: {
            street: 'Hauptstraße',
            number: {
                one: { three: 3 },
                two: 2,
            },
        },
    }
    const validatedData = validate(schema, data)

    t.deepEqual(validatedData, {
        name: 'Mark',
        address: {
            street: 'Hauptstraße',
            number: {
                one: { three: 3 },
                two: 2,
            },
        },
    })
})

test('correct validation for deeply nested declarations with arrays', t => {
    const schema = {
        name: { _type: 'String' },
        address: {
            _array: true,
            street: { _type: 'String' },
            number: {
                one: {
                    three: { _type: 'Number' },
                    four: { _type: 'String' },
                },
                two: { _type: 'Number' },
            },
        },
    }

    const data = {
        name: 'Mark',
        address: [
            {
                street: 'Hauptstraße',
                number: {
                    one: {
                        three: 3,
                        four: 'four',
                    },
                    two: 2,
                },
            },
            {
                street: 'Hauptstraße',
                number: {
                    one: {
                        three: 3,
                        four: 'four',
                    },
                    two: 2,
                },
            },
        ],
    }
    const validatedData = validate(schema, data)

    t.deepEqual(validatedData, {
        name: 'Mark',
        address: [
            {
                street: 'Hauptstraße',
                number: {
                    one: {
                        three: 3,
                        four: 'four',
                    },
                    two: 2,
                },
            },
            {
                street: 'Hauptstraße',
                number: {
                    one: {
                        three: 3,
                        four: 'four',
                    },
                    two: 2,
                },
            },
        ],
    })
})

test('fail validation for deeply nested invalid types', t => {
    const schema = {
        name: { _type: 'String' },
        address: {
            _array: true,
            street: { _type: 'String' },
            number: {
                one: {
                    three: { _type: 'Number' },
                    four: { _type: 'Number' },
                },
                two: { _type: 'Number' },
            },
        },
    }

    const data = {
        name: 'Mark',
        address: [
            {
                street: 'Hauptstraße',
                number: {
                    one: {
                        three: 3,
                        four: 4,
                    },
                    two: 2,
                },
            },
            {
                street: 'Hauptstraße',
                number: {
                    one: {
                        three: 3,
                        four: 'four',
                    },
                    two: 'two',
                },
            },
        ],
    }

    const e = t.throws(() => validate(schema, data))
    t.true(e.message.includes('address[1].number.one.four'))
})

test('fail validation for deeply nested missing required fields', t => {
    const schema = {
        name: { _type: 'String' },
        address: {
            _array: true,
            street: { _type: 'String' },
            number: {
                one: {
                    three: { _type: 'Number' },
                    four: { _type: 'Date', _required: true },
                },
                two: { _type: 'Number' },
            },
        },
    }

    const data = {
        name: 'Mark',
        address: [
            {
                street: 'Hauptstraße',
                number: {
                    one: { three: 3 },
                    two: 2,
                },
            },
            {
                street: 'Hauptstraße',
                number: {
                    one: {
                        three: 3,
                        four: 'four',
                    },
                    two: 'two',
                },
            },
        ],
    }

    t.throws(() => validate(schema, data))
})
