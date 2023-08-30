import mongoose, {ConnectOptions} from 'mongoose'

export const connectDb = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/todos_db?directConnection=true&serverSelectionTimeoutMS=2000', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
}
