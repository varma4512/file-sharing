/**
 * Auth middleware containes the common methods to authenticate user or admin by token.
 * @method {validateAdmin('MATCH','R')} is for authenticating the token and make sure its a admin.
 */
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { messages, status, jsonStatus } = require('../helper/api.responses')
const { validationResult } = require('express-validator')
const config = require('../config/config')
const { multerFileUpload } = require('../helper/utilities.services')

const validateAdmin = (sKey, eType) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')
      if (!token) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
      let admin
      try {
        admin = await findByToken(token)
      } catch (err) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
      if (!admin) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
      req.admin = admin

      let errors
      if (req.admin.eType === 'SUPER') {
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(status.UnprocessableEntity).jsonp({
            status: jsonStatus.UnprocessableEntity,
            errors: errors.array()
          })
        }

        return next(null, null)
      } else {
        if (!req.admin.aRole.length) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })

        const roles = await findRole(req.admin.aRole)
        if (!roles.length) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })
        let aPermissions = roles.map(role => role.aPermissions)
        aPermissions = [].concat.apply([], aPermissions)
        const hasPermission = aPermissions.find((permission) => {
          return (
            permission.sKey === sKey &&
            (permission.eType === eType ||
              (eType === 'R' && permission.eType === 'W'))
          )
        })

        if (!hasPermission) {
          let hasSubAdminPermission
          if (sKey === 'DEPOSIT' && eType === 'W') {
            hasSubAdminPermission = roles.aPermissions.find((permission) => {
              return (
                permission.sKey === 'SYSTEM_USERS' && permission.eType === 'W'
              )
            })
          }
          if (!hasSubAdminPermission) {
            let message

            switch (eType) {
              case 'R':
                message = messages[req.userLanguage].read_access_denied.replace('##', sKey)
                break
              case 'W':
                message = messages[req.userLanguage].write_access_denied.replace('##', sKey)
                break
              case 'N':
                message = messages[req.userLanguage].access_denied
                break
            }

            return res.status(status.Unauthorized).jsonp({
              status: jsonStatus.Unauthorized,
              message
            })
          }
        }
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(status.UnprocessableEntity).jsonp({
            status: jsonStatus.UnprocessableEntity,
            errors: errors.array()
          })
        }

        return next(null, null)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
      return res.status(status.InternalServerError).jsonp({
        status: jsonStatus.InternalServerError,
        message: messages[req.userLanguage].error
      })
    }
  }
}

const validate = function (req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(status.UnprocessableEntity)
      .jsonp({ status: jsonStatus.UnprocessableEntity, errors: errors.array() })
  }
  next()
}

const isUserAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    req.user = {}
    let user
    try {
      // user = await UsersModel.findByToken(token)
      user = jwt.verify(token, config.JWT_SECRET_USER)
    } catch (err) {
      console.log(err)
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }

    if (!user) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }


    if (user.eStatus === 'N') {
      return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].user_blocked })
    }
    // await redisClient.hset(`at:${token}`, '_id', user._id.toString())
    // await redisClient.expire(`at:${token}`, 86400)
    req.user = user
    req.user._id = new ObjectId(user._id)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(status.UnprocessableEntity).jsonp({
        status: jsonStatus.UnprocessableEntity,
        errors: errors.array()
      })
    }
    return next(null, null)
  } catch (error) {
    console.log(error)
    return res.status(status.InternalServerError).jsonp({
      status: jsonStatus.InternalServerError,
      message: messages[req.userLanguage].error
    })
  }
}

const uploadImage = multerFileUpload().single('sImage')

const uploadMulterImage = () => {
  return async (req, res, next) => {
    uploadImage(req, res, (err) => {
      if (err) {
        if (err.message === 'Not a valid File!!') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].valid_file_type })
        else if (err.message === 'File too large') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].file_size_cannot_greater_than.replace('##', messages[req.userLanguage].oneMB) })
        else return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].cannot_upload_invalid_file })
      }
      next()
    })
  }
}
module.exports = {
  validateAdmin,
  validate,
  isUserAuthenticated,
  uploadMulterImage
}
