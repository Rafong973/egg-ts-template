import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
  sequelize: {
    enable: false,
    package: 'egg-sequelize-ts'
  },
  redis: {
    enable: false,
    package: 'egg-redis'
  },
  cors: {
    enable: true,
    package: 'egg-cors'
  }
}

export default plugin
