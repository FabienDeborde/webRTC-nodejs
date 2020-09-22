import 'dotenv/config.js'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { ExpressPeerServer } from 'peer'
import http from 'http'
// import socketIo from 'socket.io'

import roomRoutes from './routes/room'

const port = process.env.PORT || 4001

const app = express()
const server = new http.Server(app)
// const io = socketIo(server, { path: '/rooms' })

const peerServer = ExpressPeerServer(server, {
  path: '/broker',
  allow_discovery: true
})

app.use(compression())
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())

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

// io.on('connection', socket => {
//   socket.on('join-room', (roomId, userId) => {
//     console.log('room id', roomId)
//     console.log('user id', userId)
//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected', userId)
//   })
// })

server.listen(port, () => console.log(`Listening on port ${port}`))
