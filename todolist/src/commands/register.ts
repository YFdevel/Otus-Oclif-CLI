import {Args, Command, Flags, ux} from '@oclif/core'
import {hashSync, compareSync} from 'bcrypt-ts'

// eslint-disable-next-line node/no-missing-import
import {connectDb} from '../utils/connect-db.js'
// eslint-disable-next-line node/no-missing-import
import UserModel from '../models/user-model.js'
// eslint-disable-next-line node/no-missing-import
import {UserModelDto} from '../dto/user-model-dto.js'
// eslint-disable-next-line node/no-missing-import
import {Login} from './login.js'
import {All} from "./all";

interface UserCreateDto {
  firstName: string,
  lastName: string,
  nickName: string,
  password: string
}

export class Register extends Command {
  static description = 'User Registration here'

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

  public async createUser(body: UserCreateDto): Promise<UserCreateDto> {
    const {firstName, lastName, nickName, password} = body
    const userFounded = await UserModel.findOne({nickName})
    let validPassword = false
    if (userFounded) {
      validPassword = compareSync(password, userFounded.password);
    }

    if (validPassword) {
      throw new Error('Пользователь с такими данными уже зарегистрирован')
    }

    const hashPass = hashSync(password, 7)
    const userCreated = await UserModel.create({
      firstName,
      lastName,
      nickName,
      password: hashPass,
    })
    return userCreated
  }

  public async userRegister(): Promise<UserCreateDto> {
    const firstName: string = await ux.prompt('What is your name?')
    const lastName: string = await ux.prompt('What is your lastname?')
    const nickName: string = await ux.prompt('Enter your nickname')
    const password: string = await ux.prompt('Enter your password')
    const user = await this.createUser({firstName, lastName, nickName, password})
    return user
  }

  public async run(): Promise<void> {
    await connectDb()
    const user = await this.userRegister()
    await this.parse(Register)
    if (user) {
      this.log('Account created successfully!')
      this.log('Enter your nickname and password for starting!')
      setTimeout(() => {
        Login.run([])
      }, 1000)
    } else {
      this.log('Oops. An unexpected error occurred ')
    }
  }
}
