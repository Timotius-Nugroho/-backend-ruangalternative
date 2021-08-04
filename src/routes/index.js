const express = require('express')
const Route = express.Router()
const apiRouter = require('../modules/routes')

Route.use('/', apiRouter)

module.exports = Route
