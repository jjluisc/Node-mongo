const { request, response } = require("express")


const validateRole = (req = request, res = response, next) => {

    if (!req.userAuth) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const { role, name } = req.userAuth

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `El ${name} no es ADMINISTRADOR - No puede hacer esto`
        })
    }

    next()
}

const haveRole = (...roles) => {
    return (req = request, res = response, next) => {

        if (!req.userAuth) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if (!roles.includes(req.userAuth.role)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }
        console.log(roles, req.userAuth.role)

        next()
    }
}

module.exports = {
    validateRole,
    haveRole
}