import {Command, Flags} from '@oclif/core'
import inquirer from 'inquirer'

// eslint-disable-next-line node/no-missing-import
import {Register} from './register.js'
// eslint-disable-next-line node/no-missing-import
import {Login} from './login.js'
// eslint-disable-next-line node/no-missing-import
import {token} from '../utils/token.js'

export class Start extends Command {
  static description = 'You can start the app from here'
  static flags = {
    stage: Flags.string({options: ['register', 'login', 'exit']}),
  }

  async run() {
    const {flags} = await this.parse(Start)
    let stage = flags.stage
    if (!stage) {
      const responses: any = await inquirer.prompt([{
        name: 'stage',
        message: 'select a stage',
        type: 'list',
        choices: [{name: 'register'}, {name: 'login'}, {name: 'exit'}],
      }])
      stage = responses.stage
    }

    switch (stage) {
    case 'register':
      await Register.run()
      break
    case 'login':
      await Login.run()
      this.log(token.key as any)
      break
    default:
      throw new Error('Что-то пошло не так')
    }
    // this.log(`the stage is: ${stage}`)
  }
}
