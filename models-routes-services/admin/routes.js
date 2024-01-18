const router = require('express').Router()
const adminServices = require('./services')
const validators = require('./validators')
const { validate,validateAdmin } = require('../../middlewares/middleware')

router.post('/admin/login', validators.adminLogin, validate, adminServices.login)

router.get('/admin/user/list',validateAdmin('USER','R'), adminServices.list)

router.get('/admin/user/:id/file',validateAdmin('USER-FILE','R'),validators.validateMongoId, validate, adminServices.userFileInfo)

router.get('/admin/file/:id',validateAdmin('USER-FILE','W'),validators.validateMongoId, validate, adminServices.userFileDownload)


module.exports = router
