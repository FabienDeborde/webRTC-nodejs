import 'dotenv/config.js'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { ExpressPeerServer } from 'peer'
import http from 'http'
import socketIo from 'socket.io'
import { errorMiddleware } from './middlewares/errors'
import { ipMiddleware } from './middlewares/ip'
import chalk from 'chalk'

import roomRoutes from './routes/room'
import { decrypt } from './utils/encryption'

const port = process.env.PORT || 4001
const whitelist = [
  'https://webrtc-sample.netlify.app/',
  process.env.NODE_ENV === 'development' && 'http://localhost'
]
const corsOptions = {
  origin: whitelist
}

const app = express()
const server = new http.Server(app)
const io = socketIo(server, { path: '/socket' })

const peerServer = ExpressPeerServer(server, {
  allow_discovery: true
})

app.use(compression())
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
app.use(errorMiddleware)
app.use(ipMiddleware)

app.use('/rooms', roomRoutes)
app.use('/peer', peerServer)

// const getApiAndEmit = socket => {
//   const response = new Date()
//   // Emitting a new message. Will be consumed by the client
//   socket.emit('FromAPI', response)
// }

// io.on('connection', (socket) => {
//   console.log('New client connected', socket)
//   socket.emit('FromAPI', 'hello there')
//   socket.on('disconnect', () => {
//     console.log('Client disconnected')
//   })
// })

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log(`${chalk.black.bgGreen(' New Socket Connection ')} user ${userId} joined the room ${decrypt(decodeURIComponent(roomId))}`)

    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

peerServer.on('connection', client => {
  console.log(`${chalk.black.bgYellow(' New Peer Connection ')} user ${client.getId()} connected to peer`)
})

server.listen(port, () => console.log(`Listening on port ${port}`))
