// eslint-disable-next-line node/no-missing-import
import {connectDb} from '../utils/connect-db.js'
// eslint-disable-next-line node/no-missing-import
import TodoModel from '../models/todo-model.js'
// eslint-disable-next-line node/no-missing-import
import {TodoToChange} from '../utils/temp-todo-id.js'
// eslint-disable-next-line node/no-missing-import
import {All} from '../commands/all.js'

export const deleteTodo = async (): Promise<void> => {
  await connectDb()
  const response: any = await TodoModel.findByIdAndDelete(TodoToChange.todoId)
  if (response) {
    console.log('Todo deleted successfully!')
    setTimeout(() => {
      All.run([])
    }, 1000)
  } else {
    console.log('Oops. An unexpected error occurred ')
  }
}
