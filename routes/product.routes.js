const { Router } = require('express')
const { check } = require('express-validator')

const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controllers')
const { isValidCategoryById, isValidProductById } = require('../helpers/db-validators')
const { validateInp, validateJWT, validateRole } = require('../middlewares')
const { Product } = require('../models')

const router = Router()



router.get('/', getAllProducts)

router.get('/:id', [
    check('id', 'No es un ID de Mongo valido.').isMongoId(),
    check('id').custom(isValidProductById),
], getProduct)


router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un ID de Mongo valido').isMongoId(),
    check('category').custom(isValidCategoryById),
    validateInp
], createProduct)


router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID de Mongo valido - update').isMongoId(),
    check('id').custom(isValidProductById),
    validateInp
], updateProduct)

router.delete('/:id', [
    validateJWT,
    validateRole,
    check('id', 'No es un ID de Mongo valido - update').isMongoId(),
    check('id').custom(isValidProductById),
    validateInp
], deleteProduct)

module.exports = router