const { validationResult } = require('express-validator')

const validateInp = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors)
    }
    next()
}

module.exports = {
    validateInp
}