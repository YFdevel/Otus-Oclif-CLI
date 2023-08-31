import mongoose from 'mongoose'

const User = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  nickName: {type: String, unique: true, required: true},
  password: {type: String, required: true},
})
export default mongoose.model('User', User)
