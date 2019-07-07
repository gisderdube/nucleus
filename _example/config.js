const path = require('path')

global.NUCLEUS_CONFIG = {
    IS_PRODUCTION: false,
    IS_STAGING: false,
    IS_DEV: true,
    IS_TEST: process.env.NODE_ENV === 'test',
    PORT: 3000,
    ENFORCE_SSL: true,
    MONGODB_URI: 'mongodb://localhost:27017/test',
    // MONGODB_MODELS_PATH: path.join(__dirname, 'models'),
    SERVICE_PATH: path.join(__dirname, 'services'),
    SERVICE_ENDPOINT: '/service',
    JWT_SECRET: 'qwjepqwhenuo123hu1nwsc_qwe1',
    ERRORS: {
        INVALID_PASSWORD: {
            status: 400,
            code: 'invalid-password',
            description: 'The password you provided is invalid.',
        },
    },
}
