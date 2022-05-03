const fs = require('fs').promises
const path = require('path')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { TokenExpiredError } = jwt
const users = []
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    users.push({ email, password: hashedPassword })
    const dataFile = path.resolve('./', 'utils/data.json')
    const data = await fs.readFile(dataFile, 'utf8')
    // console.log(data)
    const obj = JSON.parse(data) //now it an object
    const userId = obj.users.length + 1
    obj.users.push({ id: userId, email, password: hashedPassword }) //add some data
    json = JSON.stringify(obj) //convert it back to json
    await fs.writeFile(dataFile, json, 'utf8') // write it back
    const accessToken = jwt.sign({ userId }, 'supersecret_dont_share', {
      expiresIn: 10,
    })
    const refreshToken = jwt.sign({ userId }, 'supersecret_dont_share', {
      expiresIn: 20,
    })
    res.status(201).json({ userId, email, accessToken, refreshToken })
  } catch (err) {
    console.log(err)
    const error = new Error('Log in failed, please try again later.')
    return next(error)
  }
})

router.post('/refresh-token', async (req, res, next) => {
  // console.log('waiting...')
  // await new Promise(resolve => setTimeout(resolve, 15000))
  // console.log('waiting done...')
  const { refreshToken } = req.body
  // console.log('refreshToken', refreshToken)
  try {
    const decodedToken = jwt.verify(refreshToken, 'supersecret_dont_share')
    console.log('decoded Refres Token', decodedToken)
    let userId = decodedToken.userId
    const accessToken = jwt.sign({ userId }, 'supersecret_dont_share', {
      expiresIn: 10,
    })
    res.json({ accessToken })
  } catch (error) {
    console.log('refresh token error', error)
    if (error instanceof TokenExpiredError) {
      return res.status(401).send(error)
    }
    return res.status(401).send({
      message: 'Authentication failed! Something wrong with Refresh Token',
    })
  }
})

module.exports = router
