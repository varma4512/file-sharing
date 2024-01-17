const { body, query } = require('express-validator')
const { status } = require('../../data')

const userRegistration = [
    body('sName').not().isEmpty(),
    body('sEmail').not().isEmpty(),
    body('sPassword').not().isEmpty(),
    body('eStatus').not().isEmpty().toUpperCase().isIn(status),
    body('sCity').not().isEmpty(),
    body('sAddress').not().isEmpty(),
    body('nPinCode').not().isEmpty(),
]

const userLogin = [
    body('sEmail').not().isEmpty(),
    body('sPassword').not().isEmpty()
]

module.exports = {
    userRegistration,
    userLogin
}
