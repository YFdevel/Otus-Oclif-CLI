import {Args, Command, Flags, ux} from '@oclif/core'
import {compareSync} from 'bcrypt-ts'

// eslint-disable-next-line node/no-missing-import
import {UserLoginDto} from '../dto/user-login-dto.js'
// eslint-disable-next-line node/no-missing-import
import {UserModelDto} from '../dto/user-model-dto.js'
// eslint-disable-next-line node/no-missing-import
import {connectDb} from '../utils/connect-db.js'
// eslint-disable-next-line node/no-missing-import
import UserModel from '../models/user-model.js'
// eslint-disable-next-line node/no-missing-import
import {token} from '../utils/token.js'
// eslint-disable-next-line node/no-missing-import
import {All} from './all.js'

export class Login extends Command {
  static description = 'User Login here'

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
    file: Args.string({description: 'file to read'}),
  }

  public async loginUser(body: UserLoginDto): Promise<UserModelDto|null> {
    const {nickName, password} = body
    const user: UserModelDto|null = await UserModel.findOne({nickName})
    let validPassword = false
    if (user) {
      validPassword = compareSync(password, user.password)
    }

    if (!validPassword) {
      throw new Error('Пользователь с такими данными не найден')
    }

    token.key = true
    token.user = user
    return user
  }

  public async inputDataUser(): Promise<void> {
    const nickName: string = await ux.prompt('Enter your nickname')
    const password: string = await ux.prompt('Enter your password')
    await this.loginUser({nickName, password})
  }

  public async run(): Promise<void> {
    await connectDb()
    await this.inputDataUser()
    await this.parse(Login)
    await All.run([])
  }
}
