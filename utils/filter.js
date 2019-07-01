const validate = require('./validate')

const FILTER_OPERATORS = {
    Number: {
        GREATER_THAN: '$gt',
        LESS_THAN: '$lt',
        EQUALS: '$eq',
    },
    Date: {
        AFTER: '$gt',
        BEFORE: '$lt',
    },
    // we can extend that as needed
}

const parseFilter = (filter = {}, Schema) => {
    /**
     * example filter object:
     * {
     *      amount: {
     *          GREATER_THAN: 35,
     *          LESS_THAN: 50,
     *      },
     *      date: {
     *          BEFORE: new Date(),
     *      },
     * }
     */

    const paths = Schema.schema.paths
    const pathKeys = Object.keys(paths)
    const queries = []

    Object.keys(filter).forEach(param => {
        if (!pathKeys.includes(param)) return

        const paramType = paths[param].instance
        const paramObject = filter[param]

        if (!FILTER_OPERATORS[paramType]) {
            throw new ServiceError(
                `Unsupported filter parameter type '${paramType}' for parameter '${param}'.`
            )
        }

        const passedOperators = Object.keys(paramObject)
        passedOperators.forEach(operator => {
            if (!FILTER_OPERATORS[paramType][operator]) {
                throw new ServiceError(
                    `Unsupported filter operator '${operator}' for parameter '${param}'.`
                )
            }

            let value = paramObject[operator]

            try {
                validate(paramType, value)
            } catch (err) {
                throw new ServiceError(
                    `Filter value of '${value}' for parameter '${param}' at operator '${operator}' did not match expected type '${paramType}'.`
                )
            }

            if (paramType === 'Date') value = new Date(value)

            queries.push({ [param]: { [FILTER_OPERATORS[paramType][operator]]: value } })
        })
    })
    return queries
}

const parseSort = (sort = {}, Schema) => {
    // actually just validation atm, but can be changed later on to implement a custom sort syntax

    const schemaPaths = Object.keys(Schema.schema.paths)

    // example sort object: { date: -1 } or { date : 1 }

    if (Object.keys(sort).length === 0) return Schema.defaultSort

    Object.keys(sort).forEach(sortKey => {
        if (!schemaPaths.includes(sortKey)) {
            throw new ServiceError(`Sort key ${sortKey} not included in document.`)
        }
        const value = sort[sortKey]
        if (typeof value !== 'number' || (value !== 1 && value !== -1)) {
            throw new ServiceError(`Invalid sort value ${value} for key ${sortKey}.`)
        }
    })

    return sort
}

const buildQuery = queryArray => {
    return { $and: queryArray }
}

module.exports = {
    parseFilter,
    parseSort,
    buildQuery,
}
