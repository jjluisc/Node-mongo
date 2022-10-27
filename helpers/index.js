
const dbValidators = require('./db-validators')
const JWTgenerator = require('./generator-jwt')
const GoogleVerify = require('./google-verify')
const fileUP = require('./up-file')


module.exports = {
    ...dbValidators,
    ...JWTgenerator,
    ...GoogleVerify,
    ...fileUP
}