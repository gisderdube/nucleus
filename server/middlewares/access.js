const access = ({ open = false, system = false, admin = false }, identity) => {
    if (!open && !identity) throw new ServiceError('NO_AUTH')
    if (admin && (!identity || identity.role !== 'admin')) {
        throw new ServiceError('NO_PERMISSION', 'The endpoint is for admin use only.')
    }
    if (system) throw new ServiceError('NO_PERMISSION', 'The endpoint is for internal use only.')
}

module.exports = access
