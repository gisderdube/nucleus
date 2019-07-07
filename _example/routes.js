module.exports = server => {
    server.use('/test', (req, res) => {
        res.send('TEST')
    })
}
