class ServiceError extends Error {
    constructor(code = 'GENERIC', ...params) {
        super(...params)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServiceError)
        }

        this.code = code
    }
}

module.exports = ServiceError
