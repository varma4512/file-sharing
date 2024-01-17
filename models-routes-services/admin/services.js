const AdminModel = require('./model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, pick, validatePassword } = require('../../helper/utilities.services')
const bcrypt = require('bcryptjs')
const saltRounds = 1 // we can increase decrease salt round as per requirement
const salt = bcrypt.genSaltSync(saltRounds) // generate slat
const jwt = require('jsonwebtoken')
const config = require('../../config/config')

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
            if (!bcrypt.compareSync(req.body.sPassword, userDetails.sPassword)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid_username_and_password })

            // we can implement refresh token flow for more security
            const sToken = jwt.sign({ _id: (userDetails._id).toHexString(), eStatus: 'Y' }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })

            return res.status(status.OK).header({ Authorization: sToken }).json({ status: jsonStatus.OK, message: messages[req.userLanguage].login_success.replace('##', messages[req.userLanguage].admin), data: userDetails })
        } catch (error) {
            return catchError('Admin.login', error, req, res)
        }
    }
}

module.exports = new Admin()
