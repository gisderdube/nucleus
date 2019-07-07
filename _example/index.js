require('./config')
const routes = require('./routes')
const middlewares = require('./middlewares')
const { startServer } = require('..')

startServer(routes, middlewares)
