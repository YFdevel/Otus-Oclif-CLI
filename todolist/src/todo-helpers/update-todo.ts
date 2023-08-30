// eslint-disable-next-line node/no-missing-import
import {connectDb} from '../utils/connect-db.js'
// eslint-disable-next-line node/no-missing-import
import TodoModel from '../models/todo-model.js'
// eslint-disable-next-line node/no-missing-import
import {token} from '../utils/token.js'
// eslint-disable-next-line node/no-missing-import
import {TodoToChange} from '../utils/temp-todo-id.js'
// eslint-disable-next-line node/no-missing-import
import {Create} from '../commands/create.js'
// eslint-disable-next-line node/no-missing-import
import {All} from '../commands/all.js'

export const updateTodo = async (): Promise<void> => {
  await connectDb()
  const text = await Create.inputMessage()
  const expired = await Create.inputDateExpired()

  if (expired < new Date()) {
    throw new Error('Вводимая дата меньше текущей')
  }

  const updatedTodo = {text, expired}
  const response: any = await TodoModel.findByIdAndUpdate(TodoToChange.todoId, updatedTodo, {new: true})
  if (response) {
    console.log('Todo updated successfully!')
    setTimeout(() => {
      All.run([])
    }, 1000)
  } else {
    console.log('Oops. An unexpected error occurred ')
  }
}
