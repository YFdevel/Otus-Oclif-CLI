import {Command, Flags} from '@oclif/core'
import inquirer from 'inquirer'
import cls from 'cli-color'

// eslint-disable-next-line node/no-missing-import
import TodoModel from '../models/todo-model.js'
// eslint-disable-next-line node/no-missing-import
import {connectDb} from '../utils/connect-db.js'
// eslint-disable-next-line node/no-missing-import
import {Detail} from './detail.js'
// eslint-disable-next-line node/no-missing-import
import {TodoToChange} from '../utils/temp-todo-id.js'
// eslint-disable-next-line node/no-missing-import
import {token} from '../utils/token.js'
// eslint-disable-next-line node/no-missing-import
import {Login} from './login.js'
// eslint-disable-next-line node/no-missing-import
import {createQuiz} from '../todo-helpers/create-quiz.js'

export class All extends Command {
  static choseId: string
  static newTodoString = cls.bgMagenta('Создать новое todo')
  static description = 'Access to your todos from here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    stage: Flags.string({options: []}),
  }

  static args = {}

  public async run(): Promise<void> {
    this.log(cls.blue('Для выхода из программы в любой момент нажмите Ctrl+C'))
    if (token.key) {
      await connectDb()
      const todos = await TodoModel.find({
        userId: token.user?._id,
        isDone: false,
      })
      if ([...todos].length > 0) {
        const {flags} = await this.parse(All)
        let stage = flags.stage
        if (!stage) {
          const responses: any = await inquirer.prompt([{
            name: 'stage',
            message: 'select a stage',
            type: 'list',
            choices: [...todos.map((todo, ind) => {
              return `${ind + 1}. Message: ${todo.text} Expired: ${todo.expired} Id:${todo._id}`
            }), All.newTodoString],
          }])
          stage = responses.stage
          All.choseId = responses.stage.slice(responses.stage.lastIndexOf(':') + 1)
          TodoToChange.todoId = All.choseId
        }

        await (stage === All.newTodoString ? await createQuiz() : await Detail.run([]))
      } else {
        console.log(cls.cyan('Список запланированных дел пуст'))
        await createQuiz()
      }
    } else {
      await Login.run()
    }
  }
}
