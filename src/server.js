const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const socketIo = require('socket.io')
const http = require('http')

const port = process.env.PORT || 4001
const routes = require('./routes')

const app = express()
const server = http.Server(app)
const io = socketIo(server, { path: '/rooms' })

app.use(compression())
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())

app.use(routes)

const getApiAndEmit = socket => {
  const response = new Date()
  // Emitting a new message. Will be consumed by the client
  socket.emit('FromAPI', response)
}

// io.on('connection', (socket) => {
//   console.log('New client connected', socket)
//   socket.emit('FromAPI', 'hello there')
//   socket.on('disconnect', () => {
//     console.log('Client disconnected')
//   })
// })

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log('room id', roomId)
    console.log('user id', userId)
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
