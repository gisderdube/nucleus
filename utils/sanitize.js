const moment = require('moment')

const sanitize = (type, value, operations = '') => {
    // NOTE unknown operations passed will be ignored

    operations = operations.split('|').filter(el => el.length > 0)

    switch (type) {
        case 'String':
            return sanitizeString(value, operations)
        case 'Email':
            return sanitizeString(value, ['removeSpaces', 'lowerCase'])
        case 'ObjectId':
            return sanitizeObjectId(value, operations)
        case 'Date':
            return sanitizeDate(value, operations)
        case 'Slugify':
            return slugify(value)
        default:
            return value
    }
}

const sanitizeString = (value, operations) => {
    const knownOperations = {
        lowerCase: input => input.toLowerCase(),

        upperCase: input => input.toUpperCase(),

        capitalize: input =>
            input
                .toLowerCase()
                .split('')
                .map((el, index) => (index === 0 ? el.toUpperCase() : el))
                .join(''),

        trim: input => input.trim(),

        removeSpaces: input => input.replace(/\s/g, ''),
    }

    let sanitized = value
    operations.forEach(op => {
        if (knownOperations[op]) sanitized = knownOperations[op](sanitized)
    })

    return sanitized
}

const sanitizeObjectId = (value, conditions) => {
    return value.toString()
}

const sanitizeDate = (value, conditions) => {
    return moment(value)
}

const slugify = value => {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return value
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(p, c => b.charAt(a.indexOf(c)))
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

module.exports = sanitize
