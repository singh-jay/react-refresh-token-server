const cluster = require('cluster')
const http = require('http')
const process = require('process')
const os = require('os')
const fs = require('fs').promises
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const authRoutes = require('./routes/auth-routes')
const isAuthenticated = require('./middleware/is-authenticated')
const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())
app.use('/auth', authRoutes)
app.use(isAuthenticated)
app.get('/get-current-user', async (req, res, next) => {
  try {
    const dataFile = path.resolve('./', 'utils/data.json')
    const data = await fs.readFile(dataFile, 'utf8')
    const obj = JSON.parse(data)
    const currentUser = obj.users.find(i => i.id === req.userId)
    res.json(currentUser)
  } catch (error) {
    console.log(error)
    return next(error)
  }
})
app.use((req, res, next) => {
  const error = new Error('Could not find this route.')
  throw error
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'An unknown error occurred!' })
})
app.listen(8000, () => console.log('server started on http://localhost:8000'))

// const cpus = os.cpus

// const numCPUs = cpus().length

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`)

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork()
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`)
//   })
// } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
//   http
//     .createServer(app)
//     .listen(8000, () =>
//       console.log(
//         `Worker ${process.pid} server started on http://localhost:8000`
//       )
//     )
// }
