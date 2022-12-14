const { Category, Product } = require('../models')
const Role = require('../models/role')
const User = require('../models/user')

const isValidRole = async (role = '') => {
    const existeRol = await Role.findOne({ role })
    if (!existeRol) {
        throw new Error(`El rol ${role} no esta registrado en la base de datos`)
    }
}

const isValidMail = async (mail = '') => {
    const mailExist = await User.findOne({ mail })
    if (mailExist) {
        throw new Error(`El correo: ${mail}, ya esta registrado`)
    }
}

const isValidUserById = async (id = '') => {
    const userValid = await User.findById(id)
    if (!userValid) {
        throw new Error(`El ID: ${id}, no corresponde a un usuario existente`)
    }
}

const isAdminUserByRole = async (role = 'ADMIN_ROLE') => {
    const userValid = await User.findOne({ role })
    if (!userValid) {
        throw new Error('El usuario no tiene un rol valido para esta operacion')
    }
}

const isValidCategoryById = async (id) => {
    const categValid = await Category.findById(id)
    if (!categValid) {
        throw new Error(`No existe categoria con el ID ${id}`)
    }
}

const isValidProductById = async (id) => {
    const productValid = await Product.findById(id)
    if (!productValid) {
        throw new Error(`No existe producto con el ID ${id}`)
    }
}

const allowedSchemas = async (schema = '', schemas = []) => {
    const includ = schemas.includes(schema)
    if (!includ) {
        throw new Error(`La coleccion ${schema} no es permitida, ${schemas}`)
    }
    return true
}

module.exports = {
    isValidRole,
    isValidMail,
    isValidUserById,
    isValidCategoryById,
    isAdminUserByRole,
    isValidProductById,
    allowedSchemas
}