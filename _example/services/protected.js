const service = ({ a }, identity) => {
    return { a }
}

module.exports = {
    schema: { a: 'Number' },
    system: true,
    service,
}
