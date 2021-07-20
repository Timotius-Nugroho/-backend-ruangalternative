const connection = require('../config/mysql')

module.exports = {
  checkClientByCondition: (condition) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM client WHERE ?',
        condition,
        (error, result) => {
          !error
            ? resolve(result.length === 0 ? 0 : 1)
            : reject(new Error(error))
        }
      )
    })
  },

  getClientByCondition: (condition) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM client WHERE ?',
        condition,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  updateClientBalance: (id, balance) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE client SET ? WHERE client_id = ?',
        [balance, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...balance
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },

  addBookingOrder: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO booking SET ?', data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data
          }
          resolve(newResult)
        } else {
          reject(new Error(error))
        }
      })
    })
  },

  getBookingHistory: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM booking JOIN meeting_room ON booking.room_id = meeting_room.room_id WHERE booking.client_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  getAllRoom: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM meeting_room', (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },

  getFacilitiesByRoomId: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT facilities_name, facilities_amount FROM room_facilities WHERE room_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
