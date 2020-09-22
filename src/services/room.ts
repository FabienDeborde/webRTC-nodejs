import Room from '../models/room'
import bcrypt from 'bcryptjs'

export const create = (roomData) => {
  const { name, password } = roomData
  const room = new Room({
    name,
    password: bcrypt.hashSync(password, 10)
  })
  return room.save()
}

export const findOne = (id) => {
  return Room.findById(id)
}

export const deleteOne = (id) => {
  Room.findByIdAndRemove(id)
}

export const findAll = () => {
  return Room.find()
    .sort({ name: -1 })
}
