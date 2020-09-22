import mongoose from 'mongoose'

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('error', err => {
  console.log('err', err)
})

mongoose.connection.on('connected', (err) => {
  if (err) {
    console.warn('Failed to Establish Connection with MongoDB with Error: ' + err)
  } else {
    console.log('Successfully Established Connection with MongoDB')
  }
})

export default mongoose
