const defaultConfig = {
    IS_PRODUCTION: false,
    IS_STAGING: false,
    IS_DEV: true,
    IS_TEST: process.env.NODE_ENV === 'test',
    PORT: 3000,
    ENFORCE_SSL: true,
    MONGODB_URI: null,
    MONGODB_MODELS_PATH: null,
    SERVICE_PATH: null, // REQUIRED
    SERVICE_ENDPOINT: '/service',
    JWT_SECRET: process.env.JWT_SECRET || 'yzG4AME2CB/E+wQjRmqEvLW7U',
    ERRORS: {},
}

const additionalConfig = global.NUCLEUS_CONFIG ? { ...global.NUCLEUS_CONFIG } : {}

global.NUCLEUS_CONFIG = { ...defaultConfig, ...additionalConfig }
