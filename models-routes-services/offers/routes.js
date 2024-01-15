const router = require('express').Router()
const adminOfferServices = require('./services')
const validators = require('./validators')
const { validateAdmin } = require('../../middlewares/middleware')
const { multerFileUpload } = require('../../helper/utilities.services')

// admin
router.get('/admin/offer/list/v1', validators.limitValidator, validateAdmin('OFFER', 'R'), adminOfferServices.get)
// router.put('/admin/offer/:id/v2', validateAdmin('OFFER', 'W'), multerFileUpload().single('sImage'), adminOfferServices.updateV2)

module.exports = router
