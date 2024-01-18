const { body,param } = require('express-validator')

const adminLogin = [
    body('sEmail').not().isEmpty(),
    body('sPassword').not().isEmpty()
]

const validateMongoId = [
    param('id').isMongoId().not().isEmpty()
]

module.exports = {
    adminLogin,
    validateMongoId
}
