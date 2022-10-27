const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const User = require('../models/user')

const userGet = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query
    const query = { state: true }



    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .limit(Number(limit))
            .skip(Number(from)),
    ])

    res.json({
        total,
        users
    })
}

const userPost = async (req = request, res = response) => {
    const { name, mail, password, role } = req.body 
    
    const user = new User({ name, mail, password, role }) 
    
    const salt = bcryptjs.genSaltSync(10) 

    user.password = bcryptjs.hashSync(password, salt) 

    await user.save() 
    res.json({
        ok: true,
        msg: 'post Api',
        user
    })
}

const userPut = async (req, res = response) => {
    const { id } = req.params
    const { _id, password, google, mail, ...rest } = req.body



    if (password) {

        const salt = bcryptjs.genSaltSync(10) 
        rest.password = bcryptjs.hashSync(password, salt) 
    }

    const user = await User.findByIdAndUpdate(id, rest)

    res.json(user)
}

const userDelete = async (req, res = response) => {

    const { id } = req.params
    const uid = req.uid


    const userDelete = await User.findByIdAndUpdate(id, { state: false })

    const userAuth = req.userAuth

    res.json({
        userDelete,
        userAuth
    })
}

const userPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'patch Api'
    })
}

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}