const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')

module.exports = (app) => {
  app.use(cors())
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  /* global appRootPath */
  app.use(express.static(path.join(appRootPath, 'public')))
 
  // set language in request object
  app.use((req, res, next) => {
    switch (req.header('Language')) {
      case 'hindi':
        req.userLanguage = 'Hindi'
        break
      default :
        req.userLanguage = 'English'
    }
    next()
  })
}
