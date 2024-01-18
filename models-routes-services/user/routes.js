const router = require('express').Router()
const userServices = require('./services')
const validators = require('./validators')
const { validate, isUserAuthenticated, uploadMulterImage } = require('../../middlewares/middleware')

router.post('/user/registration', validators.userRegistration, validate, userServices.registration)
router.post('/user/login', validators.userLogin, validate, userServices.login)
router.get('/user/profile', isUserAuthenticated, userServices.profile)
router.post('/user/file/upload', isUserAuthenticated, uploadMulterImage(), userServices.fileUpload)
router.get('/user/files', isUserAuthenticated, userServices.userFiles)
router.post('/user/file/:id', isUserAuthenticated, userServices.userFileDownload)



module.exports = router
