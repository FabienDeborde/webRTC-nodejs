/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from '../database'

export type BlockedUserDocument = mongoose.Document & {
  ip: string;
  region?: string;
  tries: number;
  lastTry: Date;
  banned: boolean;
}

export const BlockedUserSchema = new mongoose.Schema(
  {
    ip: {
      desc: "The user's IP address",
      trim: true,
      type: String,
      required: true,
      unique: true
    },
    region: {
      desc: "The users's approximative region.",
      trim: true,
      type: String,
      default: null
    },
    tries: {
      desc: 'Number of tries',
      trim: true,
      type: Number,
      default: 0
    },
    lastTry: {
      desc: 'Number of users present in the room',
      type: Date,
      default: new Date()
    },
    banned: {
      desc: 'Number of users present in the room',
      type: Boolean,
      default: false
    }
  },
  {
    strict: true,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

BlockedUserSchema.pre('updateOne', async function (next: any) {
  const docToUpdate = await mongoose.models.BlockedUser.findOne(this.getQuery())
  if (docToUpdate && docToUpdate.tries >= 9) {
    this.update({}, { banned: true }).exec()
  }
  next()
})

export default mongoose.model<BlockedUserDocument>('BlockedUser', BlockedUserSchema, 'blocklist')
