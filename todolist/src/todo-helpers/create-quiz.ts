import {ux} from '@oclif/core'
import cls from 'cli-color'
// eslint-disable-next-line node/no-missing-import
import {Create} from '../commands/create.js'

export const createQuiz = async (): Promise<void> => {
  const answer = await ux.prompt(cls.yellow('Хотите создать новое todo? Введите y/n'))
  if (answer === 'y') {
    await Create.run()
  } else {
    throw new Error('Как жаль. Программа завершается...')
  }
}
