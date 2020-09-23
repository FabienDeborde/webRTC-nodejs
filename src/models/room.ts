import mongoose from '../database'

export type RoomDocument = mongoose.Document & {
  name?: string;
  password?: string;
  currentActiveUsers?: number;
  isActive?: boolean;
  lastJoinedAt?: Date;
  lastLeftAt?: Date;
}

export const RoomSchema = new mongoose.Schema(
  {
    name: {
      desc: "The room's name.",
      trim: true,
      type: String
    },
    password: {
      desc: "The room's password",
      trim: true,
      type: String,
      required: false
    },
    currentActiveUsers: {
      desc: 'Number of users present in the room.',
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastJoinedAt: {
      type: Date,
      default: null
    },
    lastLeftAt: {
      type: Date,
      default: null
    }
  },
  {
    strict: true,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

export default mongoose.model<RoomDocument>('Room', RoomSchema, 'rooms')
