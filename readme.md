# Nucleus Server Library

This library provides utilites to easily set up express servers, including jwt authorization, service architecture, error handling, custom routes & middlewares, MongoDB setup, test setup & more.

Please have a look at the example to see the detailed usage.

## Getting started

### 1. Config

For Nucleus to work correctly, you have to define a config, before you call any of the utility functions of the library. The config is expected to be declared at `global.NUCLEUS_CONFIG`. Make sure to require this config file in your tests as well. Here is an example:

```
global.NUCLEUS_CONFIG = {
    beforeSetup: () => {}, // will be setup before the normal routes will be handled, e.g. service routes
    setup: () => {}, // will be setup after the normal routes
    IS_PRODUCTION: false,
    IS_STAGING: false,
    IS_DEV: true,
    IS_TEST: process.env.NODE_ENV === 'test',
    PORT: 3000,
    ENFORCE_SSL: true,
    MONGODB_URI: 'mongodb://localhost:27017/test',
    MONGODB_MODELS_PATH: path.join(__dirname, 'models'),
    SERVICE_PATH: path.join(__dirname, 'services'), // REQUIRED
    SERVICE_ENDPOINT: '/service',
    JWT_SECRET: 'Some_secret',
    ERRORS: {
        INVALID_PASSWORD: {
            status: 400,
            code: 'invalid-password',
            description: 'The password you provided is invalid.',
        },
    },
}

```

### 2. Start the server

You can then simply start a server:

```
    const { startServer } = require('nucleus')

    const server = await startServer()
```

That's it! The server will be running and you can acces it. However, you won't be getting much
