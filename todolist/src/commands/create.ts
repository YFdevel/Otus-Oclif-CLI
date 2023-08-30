import {Args, Command, Flags, ux} from '@oclif/core'

// eslint-disable-next-line node/no-missing-import
import {token} from '../utils/token.js'
// eslint-disable-next-line node/no-missing-import
import TodoModel from '../models/todo-model.js'
// eslint-disable-next-line node/no-missing-import
import {TodoModelDto} from '../dto/todo-model-dto.js'
// eslint-disable-next-line node/no-missing-import
import {connectDb} from '../utils/connect-db.js'
// eslint-disable-next-line node/no-missing-import
import {All} from '../commands/all.js'
// eslint-disable-next-line node/no-missing-import
import {Login} from './login.js'

export class Create extends Command {
  static description = 'Create new todo here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
  }

  static args = {
    year: Args.string({description: 'file to read'}),
  }

  public static async inputDateExpired(): Promise<Date> {
    console.log('Enter date expired for your todo:\n')
    const date = Number(await ux.prompt('Enter date'))
    const month = Number(await ux.prompt('Enter month'))
    const year = Number(await ux.prompt('Enter year'))
    const hour = Number(await ux.prompt('Enter hour'))
    const minutes = Number(await ux.prompt('Enter minutes'))
    return new Date(year, month, date, hour, minutes)
  }

  public static async inputMessage(): Promise<string> {
    const message = await ux.prompt('Enter message')
    return message
  }

  public async createTodo(): Promise<TodoModelDto> {
    const text = await Create.inputMessage()
    const expired = await Create.inputDateExpired()
    const userId = token.user?._id

    if (expired < new Date()) {
      throw new Error('Вводимая дата меньше текущей')
    }

    const todoCreated = await TodoModel.create({
      text,
      expired,
      isDone: false,
      userId,
    })
    return todoCreated
  }

  public async run(): Promise<void> {
    if (token.key) {
      await connectDb()
      const response: any = await this.createTodo()
      await this.parse(Create)
      if (response) {
        this.log('Todo created successfully!')
        setTimeout(() => {
          All.run([])
        }, 1000)
      } else {
        this.log('Oops. An unexpected error occurred ')
      }
    } else {
      await Login.run()
    }
  }
}
