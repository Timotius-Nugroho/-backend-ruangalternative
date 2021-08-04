const helper = require('../helpers/wrapper')
const {
  getUserByCondition,
  addUser,
  addArticle,
  getArticleCount,
  getAllArticle,
  getArticleById,
  addComment,
  getAllComments
} = require('./model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

module.exports = {
  login: async (req, res) => {
    try {
      const isUserExsist = await getUserByCondition({
        user_email: req.body.user_email
      })
      if (isUserExsist.length === 0) {
        return helper.response(res, 404, 'Client not found')
      }

      const checkPassword = bcrypt.compareSync(
        req.body.user_password,
        isUserExsist[0].user_password
      )
      if (!checkPassword) {
        return helper.response(res, 400, 'Worng password')
      }

      const token = jwt.sign(
        { id: isUserExsist[0].user_id },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '24h'
        }
      )

      return helper.response(res, 200, 'Succes Login', {
        token: token
      })
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  register: async (req, res) => {
    try {
      // console.log(req.body)
      const isUserExsist = await getUserByCondition({
        user_email: req.body.user_email
      })

      if (isUserExsist.length > 0) {
        return helper.response(res, 400, 'Email has been registered')
      }

      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(req.body.user_password, salt)

      const setData = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: encryptPassword
      }
      const result = await addUser(setData)
      delete result.user_password
      return helper.response(res, 200, 'Success make new account', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  addArticle: async (req, res) => {
    try {
      // console.log(req.body)
      const result = await addArticle({
        articles_banner: req.file ? req.file.filename : '',
        ...req.body
      })
      return helper.response(res, 200, 'Sucess add an article', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  getAllArticle: async (req, res) => {
    try {
      // console.log(req.query)
      let { page, limit, sort, keywords, category } = req.query

      limit = limit || '6'
      page = page || '1'
      keywords = keywords ? '%' + keywords + '%' : '%'
      category = category
        ? 'AND articles_topic LIKE "' + '%' + category + '%"'
        : ''
      sort = sort || 'articles_created_at DESC'

      page = parseInt(page)
      limit = parseInt(limit)
      const offset = page * limit - limit

      const totalData = await getArticleCount(keywords, category)
      console.log('Total Data ' + totalData)
      const totalPage = Math.ceil(totalData / limit)
      console.log('Total Page ' + totalPage)

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData
      }
      const result = await getAllArticle(
        keywords,
        category,
        sort,
        limit,
        offset
      )

      return helper.response(
        res,
        200,
        'Sucess get all article',
        result,
        pageInfo
      )
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  getArticleById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await getArticleById(id)
      if (result.length === 0) {
        return helper.response(res, 404, 'Not found')
      }

      const authorInfo = await getUserByCondition({
        user_id: result[0].user_id
      })
      delete result[0].user_id
      result[0].author_name = authorInfo[0].user_name

      return helper.response(res, 200, 'Sucess get an article', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  addComment: async (req, res) => {
    try {
      const setData = { user_id: req.decodeToken.id, ...req.body }
      const result = await addComment(setData)
      return helper.response(res, 200, 'Sucess add comment', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },

  getAllComments: async (req, res) => {
    try {
      const { articleId } = req.query
      const result = await getAllComments(articleId)

      for (const comment of result) {
        const commentatorInfo = await getUserByCondition({
          user_id: comment.user_id
        })
        delete comment.user_id
        comment.commentator = commentatorInfo[0].user_name
      }
      return helper.response(res, 200, 'Sucess get all comment', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
