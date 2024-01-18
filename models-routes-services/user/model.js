const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { FileShareDBConnect } = require('../../database/mongoose')
const data = require('../../data')

const User = new Schema({
    sName: { type: String, required: true },
    sEmail: { type: String, required: true },
    sPassword: { type: String, required: true },
    eStatus: { type: String, enum: data.status, default: 'N' }, // Y = Active, N = Inactive
    sCity: { type: String, required: true }, // required field
    sAddress: { type: String, required: true }, // required field
    nPinCode: { type: Number, required: true }, // required field
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

User.index({ sEmail: 1 })

const UserModel = FileShareDBConnect.model('users', User)

UserModel.syncIndexes().then(() => {
    console.log('User Model Indexes Synced')
}).catch((err) => {
    console.log('User Model Indexes Sync Error', err)
})
module.exports = UserModel
