const moment = require('moment')
const ObjectId = require('mongoose').Types.ObjectId

moment.suppressDeprecationWarnings = true

const validate = (type, value, conditions = {}) => {
    // passing conditions that are not known will be omitted
    const knownConditions = {
        _enum: def => {
            if (!def.includes(value)) {
                throw new Error(
                    'Condition _enum was specified, but the passed value did not match any of the elements in _enum.'
                )
            }
        },

        _required: def => {
            if (def === true && !value && value !== 0 && value !== false) {
                throw new Error('Condition _required was specified, but no value was passed.')
            }
        },
    }

    if (!conditions._required && value === undefined) return true

    Object.keys(conditions).forEach(key => {
        if (knownConditions[key]) knownConditions[key](conditions[key])
    })

    switch (type) {
        case 'Boolean':
            validateBoolean(value, conditions)
            break
        case 'String':
            validateString(value, conditions)
            break
        case 'Email':
            validateEmail(value, conditions)
            break
        case 'ObjectId':
            validateObjectId(value, conditions)
            break
        case 'Number':
            validateNumber(value, conditions)
            break
        case 'Date':
            validateDate(value, conditions)
            break
        case 'Mixed':
            break
        default:
            throw new Error(`Type for value '${value}' did not match expected type '${type}'.`)
    }

    return true
}

const validateBoolean = (value, conditions) => {
    if (typeof value !== 'boolean') throw new Error('Value did not match expected type Boolean.')
}

const validateString = (value, conditions) => {
    const knownConditions = {
        _regex: def => {
            if (!def.test(value)) throw new Error('Value did not match _regex pattern.')
        },

        _minLength: def => {
            if (value.length < def) throw new Error('Value did not fulfill _minLength condition.')
        },

        _maxLength: def => {
            if (value.length > def) throw new Error('Value did not fulfill _maxLength condition.')
        },
    }

    if (typeof value !== 'string') throw new Error('Value did not match expected type string.')

    Object.keys(conditions).forEach(key => {
        if (knownConditions[key]) knownConditions[key](conditions[key])
    })
}

const validateEmail = (value, conditions) => {
    validateString(value, conditions)

    if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
        )
    ) {
        throw new Error('Value did not match the email pattern.')
    }
}

const validateObjectId = (value, conditions) => {
    validateString(value.toString(), conditions)
    if (!/^[0-9a-fA-F]{24}$/.test(value.toString()) || !ObjectId.isValid(value.toString())) {
        throw new Error('Value did not match the ObjectId pattern.')
    }
}

const validateNumber = (value, conditions) => {
    const knownConditions = {
        _min: def => {
            if (value < def) throw new Error('Value did not fulfill the _min condition.')
        },

        _max: def => {
            if (value > def) throw new Error('Value did not fulfill the _max condition.')
        },
    }

    if (typeof value !== 'number') throw new Error('Value did not match type number.')

    Object.keys(conditions).forEach(key => {
        if (knownConditions[key]) knownConditions[key](conditions[key])
    })
}

const validateDate = (value, conditions) => {
    const knownConditions = {
        _after: def => {
            if (moment(value).toDate() < moment(def).toDate()) {
                throw new Error('Value did not fulfill the _after condition')
            }
        },

        _before: def => {
            if (moment(value).toDate() > moment(def).toDate()) {
                throw new Error('Value did not fulfill the _before condition')
            }
        },
    }

    if (
        (!(value instanceof moment) && !(value instanceof Date) && typeof value !== 'string') ||
        !moment(value).isValid()
    ) {
        throw new Error('Value did not match type Date.')
    }

    Object.keys(conditions).forEach(key => {
        if (knownConditions[key]) knownConditions[key](conditions[key])
    })
}

module.exports = validate
