const test = require('ava').default
const MemoryDB = require('mongodb-memory-server').default

const { connect } = require('./mongo')

const mongod = new MemoryDB()

const setup = async () => {
    const uri = await mongod.getConnectionString()
    process.env.MONGODB_URI = uri

    await connect(uri)
}

test.before(setup)
