const { Router } = require('express')
const { check } = require('express-validator')

const { isValidRole, isValidMail, isValidUserById } = require('../helpers/db-validators')

const { validateJWT, validateRole, haveRole, validateInp } = require('../middlewares')

const { userGet, userPut, userPost, userDelete, userPatch } = require('../controllers/user.controllers')

const router = Router()

router.get('/', userGet)

router.post('/', [
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 letras.').isLength({ min: 6 }),
    check('mail', 'El correo no es valido.').isEmail(),
    check('mail').custom(isValidMail),
    check('role').custom(isValidRole),
    validateInp
], userPost)

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(isValidUserById),
    check('role').custom(isValidRole),
    validateInp
], userPut)

router.delete('/:id', [
    validateJWT,
    haveRole('ADMIN_ROLE', 'SHELL_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(isValidUserById),
    validateInp
], userDelete)

router.patch('/', userPatch)

 
module.exports = router