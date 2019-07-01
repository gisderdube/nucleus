import test from 'ava'
const moment = require('moment')

const sanitize = require('./sanitize')

test('correct sanitization for simple string declartions', t => {
    const schema = { name: { _type: 'String', _sanitize: 'trim|upperCase' } }

    const data = { name: 'Mark ' }

    const sanitizedData = sanitize(schema, data)
    t.deepEqual(sanitizedData, { name: 'MARK' })
})

test('correct sanitization for simple date declartions without explicitly passing sanitize option', t => {
    const d = new Date()
    const schema = { date: { _type: 'Date' } }

    const data = { date: d.toISOString() }

    const sanitizedData = sanitize(schema, data)
    t.is(sanitizedData.date.format('DD.MM.YYY HH:mm'), moment(d).format('DD.MM.YYY HH:mm'))
})

test('correct sanitization for string arrays', t => {
    const schema = { names: { _type: 'String', _array: true, _sanitize: 'removeSpaces|capitalize' } }

    const data = {
        names: ['Mark ', 'JOHN', 'AlBeRt'],
    }

    const sanitizedData = sanitize(schema, data)
    t.deepEqual(sanitizedData, {
        names: ['Mark', 'John', 'Albert'],
    })
})

test('correct sanitization for nested declarations', t => {
    const schema = {
        address: {
            email: { _type: 'Email' },
            street: { _type: 'String', _sanitize: 'trim|capitalize' },
        },
    }

    const data = { address: { email: 'TEST@TEST.COM', street: ' hauptstraße' } }

    const sanitizedData = sanitize(schema, data)
    t.deepEqual(sanitizedData, { address: { email: 'test@test.com', street: 'Hauptstraße' } })
})

test('correct sanitization for nested array declarations', t => {
    const schema = {
        addresses: {
            _array: true,
            email: { _type: 'Email' },
            street: { _type: 'String', _sanitize: 'trim|capitalize' },
        },
    }

    const data = {
        addresses: [
            { email: 'TEST@TEST.COM', street: ' hauptstraße' },
            { email: 'someOTHEREMAIL@TEST.COM', street: ' main street ' },
        ],
    }

    const sanitizedData = sanitize(schema, data)
    t.deepEqual(sanitizedData, {
        addresses: [
            { email: 'test@test.com', street: 'Hauptstraße' },
            { email: 'someotheremail@test.com', street: 'Main street' },
        ],
    })
})
