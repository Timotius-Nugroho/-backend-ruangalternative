const express = require('express')
const Route = express.Router()
const {
  login,
  register,
  addArticle,
  getAllArticle,
  getArticleById,
  addComment,
  getAllComments
} = require('./controller')
const { authentication } = require('../middleware/auth')
const uploadFile = require('../middleware/uploads')

Route.post('/login', login)
Route.post('/register', register)
Route.post('/add-article', authentication, uploadFile, addArticle)
Route.get('/get-all-article', getAllArticle)
Route.get('/get-article/:id', getArticleById)
Route.post('/add-comment', authentication, addComment)
Route.get('/get-comment', getAllComments)

module.exports = Route
