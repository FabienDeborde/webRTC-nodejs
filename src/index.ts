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

import * as Room from './services/room'

const port = process.env.PORT || 4001
// const whitelist = [
//   'https://webrtc-sample.netlify.app/',
//   process.env.NODE_ENV === 'development' && 'http://localhost'
// ]
// const corsOptions = {
//   origin: whitelist
// }

console.log('NODE_ENV', process.env.NODE_ENV)
// console.log('whitelist', whitelist)

const app = express()

app.use(compression())
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
app.use(errorMiddleware)
app.use(ipMiddleware)

const server = new http.Server(app)
const io = socketIo(server, { path: '/socket' })

const peerServer = ExpressPeerServer(server, {})

app.use('/rooms', roomRoutes)
app.use('/peer', peerServer)

io.on('connection', socket => {
  socket.on('join-room', async (roomId, userId) => {
    const roomID = decrypt(decodeURIComponent(roomId))
    console.log(`${chalk.black.bgGreen(' New Socket Connection ')} user ${userId} joined the room ${roomID}`)

    socket.join(roomID)
    socket.to(roomID).broadcast.emit('user-connected', userId)
    await Room.join(roomID)

    socket.on('disconnect', async () => {
      socket.to(roomID).broadcast.emit('user-disconnected', userId)
      await Room.leave(roomID)
    })
  })
})

peerServer.on('connection', client => {
  console.log(`${chalk.black.bgYellow(' New Peer Connection ')} user ${client.getId()} connected to peer`)
})

server.listen(port, () => console.log(`Listening on port ${port}`))
