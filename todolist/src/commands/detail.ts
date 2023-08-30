import {Command, Flags} from '@oclif/core'
import inquirer from 'inquirer'

// eslint-disable-next-line node/no-missing-import
import {updateTodo} from '../todo-helpers/update-todo.js'
// eslint-disable-next-line node/no-missing-import
import {deleteTodo} from '../todo-helpers/delete-todo.js'
// eslint-disable-next-line node/no-missing-import
import {makeDone} from '../todo-helpers/make-done.js'

export class Detail extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    stage: Flags.string({options: ['Update', 'Delete', 'Make done']}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Detail)
    let stage = flags.stage
    if (!stage) {
      const responses: any = await inquirer.prompt([{
        name: 'stage',
        message: 'select a stage',
        type: 'list',
        choices: ['Update', 'Delete', 'Make done'],
      }])
      stage = responses.stage
    }

    switch (stage) {
    case 'Update':
      await updateTodo()
      break
    case 'Delete':
      await deleteTodo()
      break
    case 'Make done':
      await makeDone()
      break
    default:
      throw new Error('Что-то пошло не так')
    }
  }
}
