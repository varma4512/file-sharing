const AdminModel = require('./model')
const UserModel = require('../user/model')
const FileModel = require('../user/file/model')

const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, pick, validatePassword } = require('../../helper/utilities.services')
const bcrypt = require('bcryptjs')
const saltRounds = 1 // we can increase decrease salt round as per requirement
const salt = bcrypt.genSaltSync(saltRounds) // generate slat
const jwt = require('jsonwebtoken')
const config = require('../../config/config')

const fs = require('fs')

class Admin {
    async login(req, res) {
        try {
            req.body = pick(req.body, ['sEmail', 'sPassword'])
            // check if user exists or not
            let emailInLowerCase = req.body.sEmail.toLowerCase()

            // find user condition, only active user
            let condition = { 'sEmail': emailInLowerCase, eStatus: 'Y' }
            const adminDetails = await AdminModel.findOne(condition).lean()

            if (!adminDetails) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_username_and_password })
            if (req.body.sPassword && !validatePassword(req.body.sPassword)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_username_and_password })

            // check hashed password is same as requested
            if (!bcrypt.compareSync(req.body.sPassword, adminDetails.sPassword)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_username_and_password })

            // we can implement refresh token flow for more security
            const sToken = jwt.sign({ _id: (adminDetails._id).toHexString(), eStatus: 'Y' }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

            return res.status(status.OK).header({ Authorization: sToken }).json({ status: jsonStatus.OK, message: messages[req.userLanguage].login_success.replace('##', messages[req.userLanguage].admin), data: adminDetails })
        } catch (error) {
            return catchError('Admin.login', error, req, res)
        }
    }

    async list(req,res){
        try {
           let start = 0 
           let limit = 10
           let sort = 'dCreatedAt' 
           const orderBy = order && order === 'asc' ? 1 : -1
           const sorting = { [sort]: orderBy } 
           let users = await UserModel.find({ eStatus: 'Y' }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()
           return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].user), data : users })
        } catch (error) {
            return catchError('Admin.list', error, req, res)
        }
    }

    async userFileInfo(req,res){
        try {
            let start = 0 
            let limit = 10
            let sort = 'dCreatedAt' 
            const orderBy = order && order === 'asc' ? 1 : -1
            const sorting = { [sort]: orderBy }
            let userId = req.params.id
            let usersFileInfo = await FileModel.find({ iUserId : userId },{ sPath:true,sFileName:true,sOriginalName:true }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].userFileInfo), data : usersFileInfo })
        } catch (error) {
            return catchError('Admin.userFileInfo', error, req, res)   
        }
    }

    async userFileDownload(req,res){
        try {
            let fileId = req.params.id

            // file record find from collection           
            let fileInfo = await FileModel.findOne({_id:fileId },{ sPath:true }).lean()

            // check if we have the uploaded file or not
            if(!fs.existsSync(fileInfo.sPath)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cFile)})

            //send response
            return res.download(fileInfo.sPath)
        } catch (error) {
            return catchError('Admin.userFileDownload', error, req, res)   
        }
    }
}

module.exports = new Admin()
