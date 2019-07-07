const { callService } = require('../../index')

const service = async ({ fail, ...data }, identity) => {
    if (fail) throw new ServiceError(null, 'The ping service failed on purpose')
    const result = await callService('/protected', { a: 2 })
    return { success: true, ...result }
}

module.exports = {
    schema: { fail: 'Boolean', hello: { _type: 'String', _required: true, _sanitize: 'lowerCase' } },
    open: true,
    system: false,
    service,
}
