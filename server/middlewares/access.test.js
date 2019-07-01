import test from 'ava'

const access = require('./access')

test('disallow access for non-open settings without identity', t => {
    const error = t.throws(() => {
        access({ open: false })
    })
    t.is(error.code, 'NO_AUTH')
})

test('disallow access for non-system settings', t => {
    const error = t.throws(() => {
        access({ system: true }, {})
    })
    t.is(error.code, 'NO_PERMISSION')
})

test('disallow access for admin endpoints', t => {
    const error = t.throws(() => {
        access({ admin: true }, {})
    })
    t.is(error.code, 'NO_PERMISSION')

    const e = t.throws(() => {
        access({ admin: true })
    })
    t.is(e.code, 'NO_AUTH')
})

test('allow access for admins', t => {
    access({ admin: true }, { role: 'admin' })
    t.pass()
})

test('allow access for open settings without identity', t => {
    access({ open: true })
    t.pass()
})

test('allow access for non-open and non-system settings with identity', t => {
    access({}, { id: 'some_id' })
    t.pass()
})
