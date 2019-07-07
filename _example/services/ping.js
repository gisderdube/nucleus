const { callService } = require('../../index')

const service = async (data, identity) => {
    if (data.fail) throw new ServiceError(null, 'The ping service failed on purpose')
    const result = await callService('/protected', { a: 2 })
    return { success: true, ...result }
}

module.exports = {
    schema: {
        fail: 'Boolean',
        hello: { _type: 'String', _required: true, _sanitize: 'lowerCase' },
        file: {
            _type: 'File',
            _minSize: 1000,
        },
        date: 'Date',
        favorite_number: 'Number',
    },
    open: true,
    system: false,
    service,
}
