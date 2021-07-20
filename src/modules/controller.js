const helper = require('../helpers/wrapper')
const {
  checkClientByCondition,
  getClientByCondition,
  updateClientBalance,
  addBookingOrder,
  getBookingHistory,
  getAllRoom,
  getFacilitiesByRoomId
} = require('./model')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  login: async (req, res) => {
    try {
      const dataLogin = req.body
      const isClientExsist = await checkClientByCondition(dataLogin)
      if (!isClientExsist) {
        return helper.response(res, 404, 'Client not found')
      }
      const token = jwt.sign({ ...dataLogin }, process.env.PRIVATE_KEY, {
        expiresIn: '24h'
      })

      return helper.response(res, 200, 'Succes Login', {
        token: token,
        cilentEmail: dataLogin.client_email
      })
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  clientInfo: async (req, res) => {
    try {
      const client = await getClientByCondition({
        client_email: req.body.client_email
      })

      if (client.length === 0) {
        return helper.response(res, 404, 'Client not found')
      }

      return helper.response(res, 200, 'Succes Login', client)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  bookingRoom: async (req, res) => {
    try {
      const dataBooking = req.body
      const client = await getClientByCondition({
        client_id: dataBooking.client_id
      })

      if (client.length === 0) {
        return helper.response(res, 404, 'Client not found')
      }
      if (
        parseInt(client[0].client_balance) < parseInt(dataBooking.booking_time)
      ) {
        return helper.response(res, 400, 'Not enough balance')
      }

      const newBalance =
        parseInt(client[0].client_balance) - parseInt(dataBooking.booking_time)
      const result = await addBookingOrder(dataBooking)
      await updateClientBalance(client[0].client_id, {
        client_balance: newBalance
      })
      return helper.response(res, 200, 'Succes booking room', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  bookingHistory: async (req, res) => {
    try {
      const client = await getClientByCondition({
        client_email: req.params.email
      })

      const result = await getBookingHistory(client[0].client_id)
      return helper.response(res, 200, 'Succes get booking history', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  allRoom: async (req, res) => {
    try {
      const result = await getAllRoom()

      for (const room of result) {
        room.facilities = await getFacilitiesByRoomId(room.room_id)
      }
      return helper.response(res, 200, 'Succes all meeting room', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
