const OfferModel = require('./model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, pick, getPaginationValues2, checkValidImageType, getBucketName } = require('../../helper/utilities.services')
const config = require('../../config/config')
const fs = require('fs')
const { removeImageFromLocal } = require('../../helper/utilities.services')

class AdminOffer {
  async get(req, res) {
    try {
      const offer = await OfferModel.findById(req.params.id).lean()
      if (!offer) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].coffer) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].coffer), data: offer })
    } catch (error) {
      return catchError('AdminOffer.get', error, req, res)
    }
  }
}

module.exports = new AdminOffer()
