const { Router } = require('express')
const { check } = require('express-validator')
const { createCategory, getCategorys, getCategory, updateCategory, deleteCategory } = require('../controllers/category.controllers')
const { isValidCategoryById, isAdminUserByRole } = require('../helpers/db-validators')
const { validateInp, validateJWT } = require('../middlewares')

const router = Router()



router.get('/', getCategorys)


router.get('/:id', [
    check('id', 'No es un ID de Mongo valido.').isMongoId(),
    check('id').custom(isValidCategoryById),
    validateInp,
], getCategory)

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateInp
], createCategory)

router.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('id').custom(isValidCategoryById),
    validateInp
], updateCategory)

router.delete('/:id', [
    validateJWT,
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('id').custom(isValidCategoryById),
    check('role').custom(isAdminUserByRole),
    validateInp
], deleteCategory)

module.exports = router