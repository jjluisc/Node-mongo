const { Router } = require('express')
const { check } = require('express-validator')

const { uploadFile, updateFile, showImg, updateFileClaudinary } = require('../controllers/upload.controllers')
const { allowedSchemas } = require('../helpers')
const { validateJWT, validateArch } = require('../middlewares')
const { validateInp } = require('../middlewares/validate-inp')

const router = Router()

router.post('/', [
    validateJWT,
    validateArch,
    validateInp
], uploadFile)

router.put('/:schema/:id', [
    validateJWT,
    validateArch,
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    check('schema').custom(c => allowedSchemas(c, ['users', 'products'])),
    validateInp
], updateFileClaudinary)

router.get('/:schema/:id', [
    validateJWT,
    check('id', 'El ID debe ser de Mongo').isMongoId(),
    check('schema').custom(c => allowedSchemas(c, ['users', 'products'])),
    validateInp
], showImg)

  
module.exports = router