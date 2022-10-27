const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const validateJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        req.uid = uid
        const userAuth = await User.findById(uid)
        if (!userAuth) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existente en BD'
            })
        }
        if (!userAuth.state) {
            return res.status(401).json({
                msg: 'Token no valido - user state false'
            })
        }

        req.userAuth = userAuth

        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validateJWT
}