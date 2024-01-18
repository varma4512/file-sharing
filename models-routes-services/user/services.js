const UserModel = require('./model')
const FileModel = require('./file/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, pick, validatePassword,validateEmail } = require('../../helper/utilities.services')
const bcrypt = require('bcryptjs')
const saltRounds = 1 // we can increase decrease salt round as per requirement
const salt = bcrypt.genSaltSync(saltRounds) // generate slat
const jwt = require('jsonwebtoken')
const config = require('../../config/config')
const fs = require('fs')
class User {
    async registration(req, res) {
        try {
            // taking only those keys which is required in request body
            req.body = pick(req.body, ['sName', 'sEmail', 'sPassword', 'eStatus', 'sCity', 'sAddress', 'nPinCode'])

            // check if user exists or not
            let emailInLowerCase = req.body.sEmail.toLowerCase()

            const isEmail = await validateEmail(emailInLowerCase)
            if (!isEmail) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,message: messages[req.userLanguage].invalid.replace('##',messages[req.userLanguage].email)})
        
            const userDetails = await UserModel.findOne({ 'sEmail': emailInLowerCase }, { sEmail: true }).lean()
            if (userDetails) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })

            if (req.body.sPassword && !validatePassword(req.body.sPassword)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_pass_format })
            // hashing password
            const sHashPassword = bcrypt.hashSync(req.body.sPassword, salt)

            // console.log('sHashPassword : =========>>>')
            // console.log(sHashPassword)

            // storing hashed password
            req.body.sPassword = sHashPassword
            // string email in lower case
            req.body.sEmail = emailInLowerCase

            // user registration
            const user = await UserModel.create(req.body)
            user.__v = undefined
            user.dUpdatedAt = undefined

            return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].register_success.replace('##', messages[req.userLanguage].user), data: user })
        } catch (error) {
            return catchError('User.registration', error, req, res)
        }
    }

    async login(req, res) {
        try {
            // taking only those keys which is required in request body

            // currently password is in raw format when we receive in request body, we can enhance this
            req.body = pick(req.body, ['sEmail', 'sPassword'])

            // check if user exists or not
            let emailInLowerCase = req.body.sEmail.toLowerCase()

            // find user condition, only active user
            let condition = { 'sEmail': emailInLowerCase, eStatus: 'Y' }
            const userDetails = await UserModel.findOne(condition).lean()
            
            if (!userDetails) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_username_and_password })
            if (req.body.sPassword && !validatePassword(req.body.sPassword)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_username_and_password })

            // check hashed password is same as requested
            if (!bcrypt.compareSync(req.body.sPassword, userDetails.sPassword)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_username_and_password })

            // we can implement refresh token flow for more security
            const sToken = jwt.sign({ _id: (userDetails._id).toHexString(), eStatus: 'Y' }, config.JWT_SECRET_USER, { expiresIn: config.JWT_VALIDITY })

            return res.status(status.OK).header({ Authorization: sToken }).json({ status: jsonStatus.OK, message: messages[req.userLanguage].login_success.replace('##', messages[req.userLanguage].user), data: userDetails })
        } catch (error) {
            return catchError('User.registration', error, req, res)
        }
    }

    async profile(req, res) {
        try {
            const userDetails = await UserModel.findOne({ _id: req.user._id }, { sPassword: false, dUpdatedAt: false }).lean()
            // remove field
            userDetails.__v = undefined
            userDetails.aJwtTokens = undefined
            userDetails.dCreatedAt = undefined

            return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].login_success.replace('##', messages[req.userLanguage].user), data: userDetails })
        } catch (error) {
            console.log(error)
            return catchError('User.registration', error, req, res)
        }
    }

    async fileUpload(req, res) {
        try {
            let fileMetaPayload = {
                sOriginalName: req.file.originalname,
                sMimetype: req.file.mimetype,
                sFileName: req.file.filename,
                sPath: req.file.path,
                sSize: req.file.size,
                iUserId: req.user._id
            }
            const fileInfo = await FileModel.create(fileMetaPayload)

            fileInfo.__v = undefined
            fileInfo.dUpdatedAt = undefined
            fileInfo.dCreatedAt = undefined

            return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].upload_success.replace('##', messages[req.userLanguage].cFile), data: fileInfo })
        } catch (error) {
            removeImageFromLocal(req)
            return catchError('User.registration', error, req, res)
        }
    }

     async userFileDownload(req,res){
        try {
            let fileId = req.params.id

            // file record find from collection           
            let fileInfo = await FileModel.findOne({_id:fileId, iUserId:req.user._id },{ sPath:true }).lean()

            // check if we have the uploaded file or not
            if(!fs.existsSync(fileInfo.sPath)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cFile)})

            //send response
            return res.download(fileInfo.sPath)
        } catch (error) {
            return catchError('Admin.userFileDownload', error, req, res)   
        }
    }

    async userFiles(req,res){
        try {
            let page = req.query.page || 1
            let limit = 10
            let skip = (page - 1) * limit
            console.log(skip)
            // file record find from collection           
            let fileInfo = await FileModel.find({ iUserId: req.user._id },{ sMimetype:false, __v:false, dUpdatedAt:false}).sort({dCreatedAt:1}).skip(Number(skip)).limit(Number(limit))

            return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cFile), data: fileInfo })
            //send response
            // return res.download(fileInfo.sPath)
        } catch (error) {
            return catchError('Admin.userFileDownload', error, req, res)   
        }
    }
}

module.exports = new User()
