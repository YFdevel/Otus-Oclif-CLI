import mongoose from 'mongoose'

const Todo = new mongoose.Schema({
  text: {type: String, required: true},
  expired: {type: Date, required: true},
  isDone: {type: Boolean, required: true},
  userId: {type: String, required: true},
})
export default mongoose.model('Todo', Todo)
