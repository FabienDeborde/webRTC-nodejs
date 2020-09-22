import * as express from 'express'
import * as Room from '../services/room'
const router = express.Router()

router.get('/', async (req, res) => {
  const rooms = await Room.findAll()
  console.log('rooms', rooms)
  res.send({ response: 'I am alive' }).status(200)
})

router.get('/:room', (req, res) => {
  res.send({ room: req.params.room })
})

export default router
