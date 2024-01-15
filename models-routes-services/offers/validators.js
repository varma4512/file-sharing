const { body, query } = require('express-validator')
const { status } = require('../../data')
const { PAGINATION_LIMIT } = require('../../config/common')

const adminAddOffers = [
  body('sTitle').not().isEmpty(),
  body('sDescription').not().isEmpty(),
  body('sDetail').not().isEmpty(),
  body('eStatus').not().isEmpty().toUpperCase().isIn(status)
]

const adminGetOfferSignedUrl = [
  body('sFileName').not().isEmpty(),
  body('sContentType').not().isEmpty()
]

const limitValidator = [
  query('limit').optional().isInt({ max: PAGINATION_LIMIT })
]

module.exports = {
  adminAddOffers,
  adminGetOfferSignedUrl,
  limitValidator
}
