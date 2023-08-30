// eslint-disable-next-line node/no-missing-import
import {connectDb} from '../utils/connect-db.js'
// eslint-disable-next-line node/no-missing-import
import TodoModel from '../models/todo-model.js'
// eslint-disable-next-line node/no-missing-import
import {TodoToChange} from '../utils/temp-todo-id.js'
// eslint-disable-next-line node/no-missing-import
import {All} from '../commands/all.js'

export const makeDone = async (): Promise<void> => {
  await connectDb()
  const updatedTodo = {isDone: true}
  const response: any = await TodoModel.findByIdAndUpdate(TodoToChange.todoId, updatedTodo, {new: true})
  if (response) {
    console.log('Todo is made done successfully!')
    setTimeout(() => {
      All.run([])
    }, 1000)
  } else {
    console.log('Oops. An unexpected error occurred ')
  }
}
