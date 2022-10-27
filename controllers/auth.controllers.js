const { response, json } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')
const { generateJWT } = require('../helpers/generator-jwt')
const { googleVerify } = require('../helpers/google-verify')

const loginController = async (req, res = response) => {

    const { mail, password } = req.body

    try {

        const users = await User.findOne({ mail })
        if (!users) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }


        if (!users.state) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - usuario'
            })
        }

        const validPass = bcryptjs.compareSync(password, users.password)
        if (!validPass) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        const token = await generateJWT(users.id)

        res.json({
            users,
            token
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            msg: 'Ups! Algo salio mal. Hable con el administrador'
        })
    }

}

const googleSingIn = async (req, res = response) => {

    const { id_token } = req.body

    try {

        const { name, img, mail } = await googleVerify(id_token)

        let users = await User.findOne({ mail })


        if (!users) {
    
            const data = {
                name,
                mail,
                password: ':P',
                img,
                google: true,
                role: "USER_ROLE"
            }
            users = new User(data)
            await users.save()
        }


        if (!users.state) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado.'
            })
        }


        const token = await generateJWT(users.id)

        res.json({
            users,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

const renewToken = async (req, res = response) => {


    const { userAuth } = req


    const token = await generateJWT(userAuth.id)

    res.json({
        userAuth,
        token
    })

}

module.exports = {
    loginController,
    googleSingIn,
    renewToken
}