const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const { FileShareDBConnect } = require('../../database/mongoose')
const config = require('../../config/config')
const data = require('../../data')

const RoleModel = require('./roles/model')
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema

// Define the Admin schema
const Admin = new Schema({
    sEmail: { type: String, trim: true, required: true },
    eType: { type: String, enum: data.adminType, default:'SUB'},
    aRole: [{ type: ObjectId, ref: RoleModel }],
    sPassword: { type: String, trim: true, required: true },
    eStatus: { type: String, enum: data.adminStatus, default: 'Y' },
    dLoginAt: { type: Date },
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

// Define indexes for Admin schema
Admin.index({ sEmail: 1 })

Admin.statics.findByToken = async function (token) {
    const admin = this
    let decoded
    try {
        // Verify the token using JWT
        decoded = jwt.verify(token, config.JWT_SECRET)
    } catch (e) {
        return Promise.reject(e)
    }
    const query = { _id: decoded._id, 'aJwtTokens': token, eStatus: 'Y' }

    const adminObj = await admin.findOne(query)
    return adminObj
}

const AdminModel = FileShareDBConnect.model('admin', Admin)

AdminModel.syncIndexes().then(() => {
    console.log('Admin Model Indexes Synced')
}).catch((err) => {
    console.log('Admin Model Indexes Sync Error', err)
})
module.exports = AdminModel

