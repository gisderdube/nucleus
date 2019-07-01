import test from 'ava'
import moment from 'moment'

const validate = require('./validate')

test('shared logic', t => {
    t.truthy(validate('String', 'some_string', { _required: true }))
    t.truthy(validate('String', undefined))
    t.truthy(
        validate('String', 'some_string', {
            _enum: ['some_string'],
        })
    )

    t.throws(() => validate('String', undefined, { _required: true }))
    t.throws(() => {
        validate('String', 'some_string', {
            _enum: ['not_included'],
        })
    })
})

test('Boolean', t => {
    t.truthy(validate('Boolean', true))
    t.truthy(validate('Boolean', false))

    // passing wrong stuff
    t.throws(() => validate('Boolean', 123))
    t.throws(() => validate('Boolean', 'some_string'))
    t.throws(() => validate('Boolean', new Date()))
    t.throws(() => validate('Boolean', {}))
    t.throws(() => validate('Boolean', new Error()))
    t.throws(() => validate('Boolean', []))
})

test('String', t => {
    t.truthy(validate('String', 'some_string'))
    t.truthy(validate('String', 'some_string', { _minLength: 3 }))
    t.truthy(validate('String', 'some_string', { _maxLength: 12 }))
    t.truthy(validate('String', 'some_string', { _maxLength: 'some_string'.length }))
    t.truthy(validate('String', 'abc', { _regex: /^abc$/ }))

    // passing wrong stuff
    t.throws(() => validate('String', 123))
    t.throws(() => validate('String', new Date()))
    t.throws(() => validate('String', {}))
    t.throws(() => validate('String', new Error()))
    t.throws(() => validate('String', []))

    // don't meet conditions
    t.throws(() => validate('String', 'some_string', { _minLength: 'some_string'.length + 1 }))
    t.throws(() => validate('String', 'some_string', { _maxLength: 'some_string'.length - 1 }))
    t.throws(() => validate('String', 'somestring', { _regex: /^[a-z]$/ }))
})

test('Email', t => {
    t.truthy(validate('Email', 'test@gmail.com'))
    t.truthy(validate('Email', 'test@gmail.co.uk'))

    // passing wrong stuff
    t.throws(() => validate('Email', 123))
    t.throws(() => validate('Email', new Date()))
    t.throws(() => validate('Email', {}))
    t.throws(() => validate('Email', new Error()))
    t.throws(() => validate('Email', []))
    t.throws(() => validate('Email', []))
    t.throws(() => validate('Email', 'no_email'))
    t.throws(() => validate('Email', 'no_email@gmail'))
})

test('ObjectId', t => {
    t.truthy(validate('ObjectId', '59845bed609cd419fc81397e'))

    // passing wrong stuff
    t.throws(() => validate('ObjectId', 123))
    t.throws(() => validate('ObjectId', new Date()))
    t.throws(() => validate('ObjectId', {}))
    t.throws(() => validate('ObjectId', new Error()))
    t.throws(() => validate('ObjectId', []))
    t.throws(() => validate('ObjectId', []))
    t.throws(() => validate('ObjectId', 'no_object_id'))
})

test('Number', t => {
    t.truthy(validate('Number', 3))
    t.truthy(validate('Number', 3, { _min: 3 }))
    t.truthy(validate('Number', 3, { _max: 3 }))

    // passing wrong stuff
    t.throws(() => validate('Number', 'not_a_number'))
    t.throws(() => validate('Number', new Date()))
    t.throws(() => validate('Number', {}))
    t.throws(() => validate('Number', new Error()))
    t.throws(() => validate('Number', []))

    // don't meet conditions
    t.throws(() => validate('Number', 5, { _min: 6 }))
    t.throws(() => validate('Number', 5, { _max: 4 }))
})

test('Date', t => {
    const m = moment()
    t.truthy(validate('Date', m))
    t.truthy(validate('Date', new Date()))
    t.truthy(validate('Date', new Date().toISOString()))

    // passing wrong stuff
    t.throws(() => validate('Date', 'not_a_date'))
    t.throws(() => validate('Date', 15))
    t.throws(() => validate('Date', {}))
    t.throws(() => validate('Date', new Error()))
    t.throws(() => validate('Date', []))

    // don't meet conditions
    t.throws(() => validate('Date', m.clone().add(5, 'days'), { _before: m.clone() }))
    t.throws(() => validate('Date', m.clone().subtract(5, 'days'), { _after: m.clone() }))
})

test('Mixed', t => {
    t.truthy(validate('Mixed', { a: 1, b: { c: true } }))
})
