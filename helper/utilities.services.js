
const { messages, status, jsonStatus } = require('./api.responses')
const multer = require('multer')
const fs = require('fs')
/**
 * It'll remove all nullish, not defined and blank properties of input object.
 * @param {object}
 */
const removenull = (obj) => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName]
    }
  }
}

const catchError = (name, error, req, res) => {
  handleCatchError(error)
  return res.status(status.InternalServerError).jsonp({
    status: jsonStatus.InternalServerError,
    message: messages[req.userLanguage].error
  })
}

const handleCatchError = (error) => {
  if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
  console.log('**********ERROR***********', error)
}

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}


function checkValidImageType (sFileName, sContentType) {
  const extension = sFileName.split('.').pop().toLowerCase()
  const valid = imageFormat.find(format => format.extension === extension && format.type === sContentType)
  return !!valid
}


const multerFileUpload = () => {
  const multerFilter = (req, file, cb) => {
    if (checkValidImageType(file.originalname, file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Not a valid File!!'), false)
    }
  }

  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1]
      let fileName = file.originalname.split('.')[0]
      fileName = fileName.replace(/(?:\.(?![^.]+$)|[^\w.])+/g, '-')
      cb(null, `${fileName}-${Date.now()}.${ext}`)
    }
  })

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  })
  return upload
}

const createDefaultFolder = (path) => {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  } catch (error) {
    console.log(error)
  }
}
createDefaultFolder('uploads')

const removeImageFromLocal = (req, removeImage) => {
  try {
    if (removeImage && req.file?.path && req.file.path.split('/').includes('uploads') && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
      return true
    }
  } catch (error) {
    return false
  }
}

module.exports = {
  removeImageFromLocal,
  multerFileUpload,
  removenull,
  catchError,
  handleCatchError,
  pick,
  checkValidImageType,
}
