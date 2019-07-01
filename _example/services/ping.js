const service = ({ fail }, identity) => {
    if (fail) throw new ServiceError(null, 'The ping service failed on purpose')
    return { success: true }
}

module.exports = {
    schema: { fail: 'Boolean', hello: { a: 'Number', _required: true } },
    open: true,
    system: false,
    service,
}
