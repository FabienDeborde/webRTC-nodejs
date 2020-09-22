const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send({ response: 'I am alive' }).status(200)
})

router.get('/:room', (req, res) => {
  res.send({ room: req.params.room })
})

module.exports = router
