import test from 'ava'
import moment from 'moment'

const sanitize = require('./sanitize')

test('String', t => {
    // correct transformations
    t.is(sanitize('String', 'somestring', 'upperCase'), 'SOMESTRING')
    t.is(sanitize('String', 'SOMEstrIng', 'lowerCase'), 'somestring')
    t.is(sanitize('String', '   something   ', 'trim'), 'something')
    t.is(sanitize('String', '   so   m ething   ', 'removeSpaces'), 'something')
    t.is(sanitize('String', ' so   m e thing', 'removeSpaces|upperCase'), 'SOMETHING')

    // ignore unknown operations
    t.is(sanitize('String', 'no_change', 'someUnkownOperation'), 'no_change')
})

test('Email', t => {
    t.is(sanitize('Email', '  hello@TEST.com'), 'hello@test.com')
})

test('ObjectId', t => {
    t.is(sanitize('ObjectId', 1234), '1234')
})

test('Date', t => {
    t.truthy(sanitize('Date', 1234) instanceof moment)

    const d = new Date()
    t.truthy(sanitize('Date', d) instanceof moment)
    t.is(sanitize('Date', d).unix(), moment(d).unix())
    t.truthy(sanitize('Date', d.toISOString()) instanceof moment)
})
