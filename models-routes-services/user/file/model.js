const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { FileShareDBConnect } = require('../../../database/mongoose')
const UserModel = require('../../user/model')

// file info
const fileInfo = new Schema({
    sOriginalName: { type: String, required: true },
    sMimetype: { type: String, required: true },
    sFileName: { type: String, required: true },
    sPath: { type: String, required: true },
    sSize: { type: String, required: true },
    iUserId: { type: mongoose.Types.ObjectId, ref: UserModel, required: true }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

fileInfo.index({ sEmail: 1 })

const fileInfoModel = FileShareDBConnect.model('fileInfo', fileInfo)

fileInfoModel.syncIndexes().then(() => {
    console.log('File info Model Indexes Synced')
}).catch((err) => {
    console.log('File info Model Indexes Sync Error', err)
})

module.exports = fileInfoModel
