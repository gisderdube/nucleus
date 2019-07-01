import test from 'ava'

test('ServiceError is defined and instanceable', t => {
    t.truthy(ServiceError)

    const e = new ServiceError()

    t.truthy(e instanceof ServiceError)
})

test('It is possible to assign a code & a message', t => {
    const e = new ServiceError('SOME_CODE', 'some_message')

    t.is(e.code, 'SOME_CODE')
    t.is(e.message, 'some_message')
})

test('Default code is GENERIC', t => {
    const e = new ServiceError()

    t.is(e.code, 'GENERIC')
})
