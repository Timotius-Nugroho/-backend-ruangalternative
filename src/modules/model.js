const connection = require('../config/mysql')

module.exports = {
  checkUserByCondition: (condition) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM users WHERE ?',
        condition,
        (error, result) => {
          !error
            ? resolve(result.length === 0 ? 0 : 1)
            : reject(new Error(error))
        }
      )
    })
  },

  getUserByCondition: (condition) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM users WHERE ?',
        condition,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  addUser: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO users SET ?', data, (error, result) => {
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

  addArticle: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO articles SET ?', data, (error, result) => {
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

  getAllArticle: (keywords, category, sort, limit, offset) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM articles WHERE articles_title LIKE ? ${category} ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [keywords, limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  getArticleCount: (keywords, category) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM articles WHERE articles_title LIKE ? ${category}`,
        keywords,
        (error, result) => {
          // console.log(result) isi array dalamnya objek
          !error ? resolve(result[0].total) : reject(new Error(error))
        }
      )
    })
  },

  getArticleById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM articles WHERE articles_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },

  addComment: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO comments SET ?', data, (error, result) => {
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

  getAllComments: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM comments WHERE articles_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
