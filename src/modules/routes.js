const express = require('express')
const Route = express.Router()
const {
  login,
  bookingRoom,
  clientInfo,
  bookingHistory,
  allRoom
} = require('./controller')
const { authentication } = require('../middleware/auth')

Route.post('/login', login)
Route.post('/booking', authentication, bookingRoom)
Route.post('/info', authentication, clientInfo)
Route.get('/history/:email', authentication, bookingHistory)
Route.get('/room', authentication, allRoom)

module.exports = Route
