import mongoose from '../database'
const schema = new mongoose.Schema(
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
    lastJoinedAt: Date,
    lastLeftAt: Date
  },
  {
    strict: true,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

export default mongoose.model('Rooms', schema)
