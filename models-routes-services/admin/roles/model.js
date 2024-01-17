const mongoose = require('mongoose')

const Schema = mongoose.Schema
const { FileShareDBConnect } = require('../../../database/mongoose')
const { status, adminPermission, adminPermissionType, moduleName } = require('../../../data')


const Roles = new Schema({
    sName: { type: String, required: true },
    aPermissions: [{
        sKey: { type: String, enum: adminPermission },
        eType: { type: String, enum: adminPermissionType },
        sModuleName: { type: String, enum: moduleName }
    }],
    eStatus: { type: String, enum: status, default: 'Y' },
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

// Create indexes for the Roles schema
Roles.index({ sName: 1 }, { unique: true })

// Create the RolesModel using the AdminsDBConnect connection
const RolesModel = FileShareDBConnect.model('roles', Roles)

// Synchronize indexes for the RolesModel
RolesModel.syncIndexes().then(() => {
    console.log('Roles Model Indexes Synced')
}).catch((err) => {
    console.log('Roles Model Indexes Sync Error', err)
})

module.exports = RolesModel
