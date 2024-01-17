const router = require('express').Router()
const adminServices = require('./services')
const validators = require('./validators')
const { validate } = require('../../middlewares/middleware')

router.post('/admin/login', validators.adminLogin, validate, adminServices.login)

module.exports = router
