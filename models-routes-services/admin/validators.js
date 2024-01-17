const { body } = require('express-validator')

const adminLogin = [
    body('sEmail').not().isEmpty(),
    body('sPassword').not().isEmpty()
]

module.exports = {
    adminLogin
}
