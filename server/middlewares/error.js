const logger = require('loglevel')

const DEFAULT_ERRORS = {
    NO_AUTH: {
        status: 401,
        code: 'no-auth',
        description: "You don't seem to be authenticated, please sign in first.",
    },
    NO_PERMISSION: {
        status: 403,
        code: 'no-permission',
        description: 'You do not have sufficient permission to request that resource.',
    },
    MISSING_PARAM: {
        status: 400,
        code: 'missing-param',
        description: 'The following parameter is missing in your request:',
    },
    NOT_FOUND: {
        status: 404,
        code: 'not-found',
        description: 'The requested resource was not found.',
    },
    INVALID_QUERY: {
        status: 400,
        code: 'invalid-query',
        description: 'Either filter or sort parameter are invalid:',
    },
    INVALID_PARAM: {
        status: 400,
        code: 'invalid-param',
        description: 'Invalid request parameter',
    },
    GENERIC: {
        status: 400,
        code: 'bad-request',
        description: 'Something was wrong with your request.',
    },
    INTERNAL: {
        status: 500,
        code: 'server-error',
        description:
            'Something went wrong with your request. This is a server issue. Please contact support.',
    },
}

const error = (res, inError) => {
    const ERRORS = { ...NUCLEUS_CONFIG.ERRORS, ...DEFAULT_ERRORS }

    let returnErr
    try {
        returnErr = ERRORS[inError.code] || ERRORS['GENERIC']
    } catch (err) {
        logger.error(err)
        returnErr = ERRORS['GENERIC']
    } finally {
        res.status(returnErr.status || 400).send({
            code: returnErr.code,
            description: `${returnErr.description} ${inError.message}`,
        })
    }
}

module.exports = error
