import BlockedUser, { BlockedUserDocument } from '../models/blockedUser'
import { Document, DocumentQuery, Query } from 'mongoose'

export const findOne = (ip: string): DocumentQuery<Document, Document, any> => {
  return BlockedUser.findOne({ ip })
}

export const createOrUpdateOne = (ip: string): Query<BlockedUserDocument> => {
  return BlockedUser.updateOne({ ip }, {
    ip,
    lastTry: new Date(),
    $inc: { tries: 1 }
  }, {
    upsert: true,
    setDefaultsOnInsert: true
  })
}
