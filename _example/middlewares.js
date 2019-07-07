module.exports = server => {
    server.use((req, res, next) => {
        if (req.headers['language']) req.identity.language = req.headers['language']

        next()
    })
}
