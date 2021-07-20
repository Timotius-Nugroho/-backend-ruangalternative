const express = require('express')
const Route = express.Router()
const clientRouter = require('../modules/routes')

Route.use('/', clientRouter)

module.exports = Route
