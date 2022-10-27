
const { response, request } = require('express')

const { Category } = require('../models')



const getCategorys = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query
    const query = { state: true }

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .limit(Number(limit))
            .skip(Number(from))
    ])

    res.json({
        total, categories
    })
}


const getCategory = async (req = request, res = response) => {

    const { id } = req.params

    const categoryFind = await Category.findById(id).populate('user', 'name')

    res.json({
        categoryFind
    })
}


const createCategory = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase()

    const categoryBD = await Category.findOne({ name })

    if (categoryBD) {
        return res.status(400).json({
            msg: `La categoria ${categoryBD.name} ya existe.`
        })
    }

    const data = {
        name,
        user: req.userAuth._id
    }
    const category = new Category(data)

    await category.save()

    res.status(201).json({ category })
}


const updateCategory = async (req = request, res = response) => {

    const { id } = req.params

    const { state, user, ...rest } = await req.body

    rest.name = rest.name.toUpperCase()
    rest.user = req.userAuth._id

    const categUpdate = await Category.findByIdAndUpdate(id, rest, { new: true }) // Este 3er param nos permite una actualizacion automatica en la respuesta

    res.json(categUpdate)

}


const deleteCategory = async (req = request, res = response) => {

    const { id } = req.params

    const categDelete = await Category.findByIdAndUpdate(id, { state: false })

    res.status(200).json({
        categDelete
    })
}







module.exports = {
    createCategory,
    getCategorys,
    getCategory,
    updateCategory,
    deleteCategory
}