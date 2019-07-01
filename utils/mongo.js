const mongoose = require('mongoose')
const logger = require('loglevel')
const fs = require('fs')
const path = require('path')

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

const requireModels = dirPath => {
    const dir = fs.readdirSync(dirPath)
    dir.forEach(model => {
        const modelPath = path.join(dirPath, model)

        if (fs.lstatSync(modelPath).isDirectory()) return requireModels(modelPath)

        require(modelPath)
    })
}

const connect = async (uri, modelsFolder) => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true })
        logger.info('Connected to MongoDB')

        if (!modelsFolder) return
        requireModels(modelsFolder)
    } catch (err) {
        logger.error('unable to connect to database\n', err)
    }
}

const clear = async modelsFolder => {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Cannot clear DB in production environment.')
    }
    if (!modelsFolder) throw new Error('Please specify a path where your models are located.')

    const dir = fs.readdirSync(modelsFolder)
    for (let modelName of dir) {
        const modelPath = path.join(modelsFolder, modelName)

        if (fs.lstatSync(modelPath).isDirectory()) return requireModels(modelPath)
        const model = require(modelPath)

        await model.remove({})
        logger.info(`Cleared ${modelName} collection.`)
    }
}

module.exports = { connect, clear }
