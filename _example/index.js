const bodyParser = require('body-parser')
const path = require('path')

const { startServer } = require('..')
console.log('path.join(__dirname,:', path.join(__dirname, 'services'))
startServer(
    server => {
        server.use('/webhooks/stripe', bodyParser.raw({ type: '*/*' }))

        server.use('*', (req, res) => {
            res.send('YISS')
        })
    },
    { MONGODB_URI: 'mongodb://localhost:27017/test', SERVICE_PATH: path.join(__dirname, 'services') }
)
