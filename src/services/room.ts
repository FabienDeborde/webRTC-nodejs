import Room, { RoomDocument } from '../models/room'
import bcrypt from 'bcryptjs'
import dayjs from 'dayjs'
import { Document, DocumentQuery, Query } from 'mongoose'
import mongodb from 'mongodb'

interface RoomData {
  name ?: string;
  password ?: string;
}

const olderThan = dayjs().subtract(30, 'd').toDate()

export const create = (roomData: RoomData): Promise<Document> => {
  const { name, password } = roomData
  const room = new Room({
    name: name || null,
    password: password ? bcrypt.hashSync(password, 10) : null
  })
  return room.save()
}

export const findOne = (id: string): DocumentQuery<Document, Document, any> => {
  return Room.findById(id)
}

export const deleteOne = (id: string): DocumentQuery<Document, Document, any> => {
  console.log('id', id)
  return Room.findByIdAndRemove(id)
}

export const deleteInactive = (): Query<mongodb.DeleteWriteOpResultObject['result'] & { deletedCount?: number }> => {
  return Room.deleteMany({
    isActive: false,
    lastLeftAt: { $lte: olderThan }
  })
}

export const findAll = (): DocumentQuery<RoomDocument[], RoomDocument, any> => {
  return Room.find()
    .sort({ name: -1 })
}
