const mongoose = require('mongoose')
const { handleCatchError } = require('../helper/utilities.services')

const config = require('../config/config')

const FileShareDBConnect = connection(config.FILE_SHARE_DB_URL,'file-share')

function connection(DB_URL, DB_NAME) {
  try {
    const conn = mongoose.createConnection(DB_URL)
    conn.on('connected', () => console.log(`Connected to ${DB_NAME} database...`))
    return conn
  } catch (error) {
    handleCatchError(error)
  }
}

module.exports = {
  FileShareDBConnect
}
