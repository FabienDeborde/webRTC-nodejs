import * as express from 'express'
import { RoomDocument } from '../models/room'
import * as Room from '../services/room'
import * as BlockUser from '../services/blockUser'
import { decrypt, encrypt, compareHash } from '../utils/encryption'
import { BlockedUserDocument } from '../models/blockedUser'
const router = express.Router()

router.get('/', async (req, res) => {
  const rooms = await Room.findAll()
  const encrypted = encrypt('5f6a9b568e81634c48f10319')
  const encoded = encodeURIComponent(encrypt('5f6a9b568e81634c48f10319'))
  const decrypted = decrypt(encrypted)
  return res.send({
    encrypted,
    encoded,
    decrypted,
    rooms
  })
})

router.post('/access', async (req, res) => {
  try {
    console.log('user ip', req.clientIP, req.ip)
    const user = await BlockUser.findOne(req.clientIP) as BlockedUserDocument
    if (user && user.banned) return res.unauthorized()
  } catch (error) {
    console.warn('Error during IP check process...', error)
  }

  const { id, password } = req.body
  if (!id) return res.badRequest('No room specified.')
  try {
    const room = await Room.findOne(decrypt(decodeURIComponent(id))) as RoomDocument
    const roomID: string = encodeURIComponent(encrypt(room && room.id))
    if (room.password) {
      if (!password) return res.unauthorized('You do not have access to this room. Please contact your administrator for further information.')
      if (compareHash(password, room.password)) {
        return res.send({ access: true, id: roomID, name: room.name })
      } else {
        await BlockUser.createOrUpdateOne(req.clientIP)
        return res.forbidden('You do not have access to this room. Please contact your administrator for further information.')
      }
    } else {
      return res.send({ access: true, id: roomID, name: room.name })
    }
  } catch (error) {
    return res.internalServerError('An error occured while retrieving the room', error)
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, password } = req.body
    const response = await Room.create({ name, password })
    console.log(response)
    // Encrypt then encode the room ID (prevent symbols when passing in URL)
    const id: string = encodeURIComponent(encrypt(response && response.id))
    return res.send({
      // decrypted: decrypt(decodeURIComponent(id)),
      id,
      name
    })
  } catch (error) {
    return res.internalServerError('An error occured while creating the room', error)
  }
})

router.delete('/', async (req, res) => {
  if (!req.body.room) return res.badRequest()
  try {
    await Room.deleteOne(decrypt(decodeURIComponent(req.body.room)))
    return res.send({ success: true })
  } catch (error) {
    return res.internalServerError('An error occured while deleting the room', error)
  }
})

router.delete('/inactive', async (req, res) => {
  try {
    const response = await Room.deleteInactive()
    console.log(response)

    return res.send({ success: true, deletedCount: response.deletedCount })
  } catch (error) {
    return res.internalServerError('An error occured while deleting the room', error)
  }
})

export default router
