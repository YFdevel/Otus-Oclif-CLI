// eslint-disable-next-line node/no-missing-import
import {UserModelDto} from '../dto/user-model-dto.js'

type User = null | UserModelDto
export const token = {
  key: false,
  user: null as User,
}

